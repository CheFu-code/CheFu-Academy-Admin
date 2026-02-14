// functions/src/webauthn.ts
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import corsLib from 'cors';
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
    RegistrationResponseJSON,
    AuthenticationResponseJSON,
    AuthenticatorTransportFuture,
} from '@simplewebauthn/server';
import { z } from 'zod';

// --- Firebase Admin init ---
initializeApp();
const db = getFirestore();
const auth = getAuth();

// --- CONFIG (tune to your domain) ---
const RP_NAME = process.env.RP_NAME || 'CheFu Academy';
const RP_ID = process.env.RP_ID || undefined; // leave undefined to accept the Host header's domain
// Allowed origins for WebAuthn ceremonies (add prod + localhost)
const ORIGINS = new Set<string>([
    'https://cheforumreal.web.app',
    'http://localhost:3000',
]);

// Store users & credentials in Firestore
const USERS = db.collection('webauthnUsers');

// Basic CORS for same-origin Hosting rewrite + local dev
const cors = corsLib({ origin: true });

// --- Types ---
type Passkey = {
    id: string; // credentialID (base64url)
    publicKey: Buffer; // raw public key
    counter: number;
    deviceType: 'singleDevice' | 'multiDevice';
    backedUp: boolean;
    transports?: AuthenticatorTransportFuture[];
    webauthnUserID: string; // base64url "user.id"
};

type WebAuthnUserDoc = {
    username: string;
    challenge?: string | null;
    credentials: Passkey[];
};

// --- Helpers ---
const getUserDoc = async (uid: string) =>
    (await USERS.doc(uid).get()).data() as WebAuthnUserDoc | undefined;

const setUserDoc = (uid: string, data: Partial<WebAuthnUserDoc>) =>
    USERS.doc(uid).set(data, { merge: true });

const ensureOrigin = (origin: string) => {
    if (!ORIGINS.has(origin)) throw new Error(`Origin not allowed: ${origin}`);
    return origin;
};

// API schema
const BodySchema = z.object({
    operation: z.enum([
        'reg-options',
        'reg-verify',
        'authn-options',
        'authn-verify',
    ]),
    uid: z.string().min(1),
    username: z.string().optional(), // for registration
    rpId: z.string().optional(), // override
    origin: z.string().url().optional(),
    response: z.any().optional(), // RegistrationResponseJSON | AuthenticationResponseJSON
});

// --- 2nd-gen HTTPS handler (single endpoint with operation switch) ---
export const webauthnApi = onRequest(
    {
        region: 'us-central1',
        cors: false, // we call cors() manually
    },
    async (req, res) => {
        cors(req, res, async () => {
            try {
                if (req.method !== 'POST') {
                    return res.status(405).send('Method Not Allowed');
                }

                const parsed = BodySchema.safeParse(req.body);
                if (!parsed.success) {
                    return res.status(400).json({ error: 'invalid-request' });
                }
                const { operation, uid, username, rpId, origin, response } =
                    parsed.data;

                const expectedOrigin =
                    origin?.trim() || (req.headers.origin as string) || '';
                ensureOrigin(expectedOrigin);

                // Decide RPID
                const effectiveRPID =
                    rpId?.trim() ||
                    RP_ID ||
                    // fallback to Host header (same-origin Hosting rewrite):
                    (req.headers['x-forwarded-host'] as string) ||
                    req.headers.host ||
                    '';

                // Load and normalize user doc to avoid crashes on legacy/partial records
                const loadedUserDoc = await getUserDoc(uid);
                const userDoc: WebAuthnUserDoc = {
                    username: loadedUserDoc?.username || username || uid,
                    challenge: loadedUserDoc?.challenge,
                    credentials: Array.isArray(loadedUserDoc?.credentials)
                        ? loadedUserDoc.credentials
                        : [],
                };

                if (operation === 'reg-options') {
                    // Generate options for registration
                    const excludeCredentials = userDoc.credentials.map(
                        (cred) => ({
                            id: cred.id,
                            type: 'public-key' as const,
                            transports: cred.transports,
                        }),
                    );

                    const options = await generateRegistrationOptions({
                        rpName: RP_NAME,
                        rpID: effectiveRPID,
                        userName: userDoc.username,
                        // Using uid as backing user handle is common
                        userID: Buffer.from(uid),
                        authenticatorSelection: {
                            // let the client attachment be flexible; you already chose defaults in UI
                            residentKey: 'preferred',
                            requireResidentKey: false,
                        },
                        excludeCredentials,
                    });

                    await setUserDoc(uid, {
                        challenge: options.challenge,
                        username: userDoc.username,
                    });
                    return res.status(200).json({ options });
                }

                if (operation === 'reg-verify') {
                    const cred = response as RegistrationResponseJSON;
                    const expectedChallenge = userDoc.challenge || '';
                    const verification = await verifyRegistrationResponse({
                        response: cred,
                        expectedChallenge,
                        expectedRPID: effectiveRPID,
                        expectedOrigin,
                    });

                    if (
                        !verification.verified ||
                        !verification.registrationInfo
                    ) {
                        return res.status(400).json({ verified: false });
                    }

                    const { credential, credentialDeviceType, credentialBackedUp } =
                        verification.registrationInfo;

                    const newPasskey: Passkey = {
                        id: credential.id,
                        publicKey: Buffer.from(credential.publicKey),
                        counter: credential.counter,
                        deviceType: credentialDeviceType,
                        backedUp: credentialBackedUp,
                        transports: credential.transports,
                        webauthnUserID: Buffer.from(uid).toString('base64url'),
                    };

                    await setUserDoc(uid, {
                        challenge: null,
                        credentials: [
                            ...userDoc.credentials.filter(
                                (c) => c.id !== newPasskey.id,
                            ),
                            newPasskey,
                        ],
                    });

                    return res.status(200).json({ verified: true });
                }

                if (operation === 'authn-options') {
                    if (userDoc.credentials.length === 0) {
                        return res
                            .status(404)
                            .json({ error: 'no-passkeys-enrolled' });
                    }

                    const allowCredentials = userDoc.credentials.map(
                        (cred) => ({
                            id: cred.id,
                            type: 'public-key' as const,
                            transports: cred.transports,
                        }),
                    );

                    const options = await generateAuthenticationOptions({
                        rpID: effectiveRPID,
                        allowCredentials,
                        userVerification: 'preferred',
                    });

                    await setUserDoc(uid, { challenge: options.challenge });
                    return res.status(200).json({ options });
                }

                if (operation === 'authn-verify') {
                    const cred = response as AuthenticationResponseJSON;
                    const expectedChallenge = userDoc.challenge || '';

                    // Lookup by credential ID
                    const credID = cred.rawId;
                    const match = userDoc.credentials.find(
                        (c) => c.id === credID,
                    );
                    if (!match) {
                        return res
                            .status(404)
                            .json({ error: 'credential-not-found' });
                    }

                    const verification = await verifyAuthenticationResponse({
                        response: cred,
                        expectedChallenge,
                        expectedRPID: effectiveRPID,
                        expectedOrigin,
                        credential: {
                            id: match.id,
                            publicKey: Uint8Array.from(match.publicKey),
                            counter: match.counter,
                            transports: match.transports,
                        },
                    });

                    if (
                        !verification.verified ||
                        !verification.authenticationInfo
                    ) {
                        return res.status(401).json({ verified: false });
                    }

                    // Update counter to prevent replays
                    const { newCounter } = verification.authenticationInfo;
                    match.counter = newCounter;
                    await setUserDoc(uid, {
                        challenge: null,
                        credentials: userDoc.credentials,
                    });

                    // Sign into Firebase: mint custom token for this uid
                    const token = await auth.createCustomToken(uid);
                    return res
                        .status(200)
                        .json({ verified: true, customToken: token });
                }

                return res.status(400).json({ error: 'unknown-operation' });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : 'Unknown error';
                logger.error('webauthnApi error', err);
                return res
                    .status(500)
                    .json({ error: 'internal', message });
            }
        });
    },
);
