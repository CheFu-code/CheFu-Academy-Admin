// functions/src/webauthn.ts
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import corsLib from 'cors';
import type { Request } from 'express';
import { createHash } from 'node:crypto';
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
// Allowed origins for WebAuthn ceremonies.
// You can override/extend this at deploy time:
// WEBAUTHN_ALLOWED_ORIGINS="https://admin.example.com,https://cheforumreal.web.app,http://localhost:3000"
const defaultOrigins = [
    'https://cheforumreal.web.app',
    'https://chefu-academy.vercel.app',
    'http://localhost:3000',
];
const envOrigins = (process.env.WEBAUTHN_ALLOWED_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
const ORIGINS = new Set<string>([...defaultOrigins, ...envOrigins]);
const ALLOW_VERCEL_PREVIEWS = process.env.WEBAUTHN_ALLOW_VERCEL_PREVIEWS === 'true';
const SIGNIN_ALERT_FROM = process.env.SIGNIN_ALERT_FROM || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

const isAllowedOrigin = (origin: string) => {
    if (ORIGINS.has(origin)) return true;
    if (!ALLOW_VERCEL_PREVIEWS) return false;
    try {
        const host = new URL(origin).hostname.toLowerCase();
        return host.endsWith('.vercel.app');
    } catch {
        return false;
    }
};

// Store users & credentials in Firestore
const USERS = db.collection('webauthnUsers');

// Basic CORS for same-origin Hosting rewrite + local dev
const cors = corsLib({
    origin: (origin, callback) => {
        if (!origin || isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Not allowed by CORS'));
    },
});

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
    signInDevices?: SignInDevice[];
};

type SignInDevice = {
    key: string;
    label: string;
    firstSeenAt: string;
    lastSeenAt: string;
    lastIpAddress: string;
    credentialId: string;
    origin: string;
};

type AppUserDoc = {
    emailPreferences?: {
        security?: boolean;
    };
};

// --- Helpers ---
const getUserDoc = async (uid: string) =>
    (await USERS.doc(uid).get()).data() as WebAuthnUserDoc | undefined;

const setUserDoc = (uid: string, data: Partial<WebAuthnUserDoc>) =>
    USERS.doc(uid).set(data, { merge: true });

const resolveUid = async (identifier: string): Promise<string> => {
    const value = identifier.trim();
    if (!value.includes('@')) return value;
    try {
        const user = await auth.getUserByEmail(value);
        return user.uid;
    } catch (error: unknown) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code?: string }).code === 'auth/user-not-found'
        ) {
            throw new Error('user-not-registered');
        }
        throw error;
    }
};

const ensureOrigin = (origin: string) => {
    if (!isAllowedOrigin(origin)) throw new Error(`Origin not allowed: ${origin}`);
    return origin;
};

const getBearerToken = (authHeader?: string) => {
    if (!authHeader) return null;
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;
    return token;
};

const getClientIp = (req: Request) => {
    const forwarded = req.headers['x-forwarded-for'];
    const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded || '';
    const firstForwardedIp = forwardedValue.split(',')[0]?.trim();
    return firstForwardedIp || req.ip || req.socket.remoteAddress || 'unknown';
};

const getUserAgent = (req: Request) =>
    (req.headers['user-agent'] as string | undefined) || 'unknown';

const createDeviceFingerprint = (details: {
    credentialId: string;
    origin: string;
}) =>
    createHash('sha256')
        .update(`${details.credentialId}|${details.origin}`)
        .digest('hex');

const escapeHtml = (s: string): string =>
    s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\//g, '&#x2F;');

const sendNewDeviceAlertEmail = async (
    uid: string,
    details: {
        origin: string;
        credentialId: string;
        ipAddress: string;
        userAgent: string;
    },
) => {
    if (!SIGNIN_ALERT_FROM || !RESEND_API_KEY) {
        logger.warn(
            'SIGNIN_ALERT_FROM/RESEND_API_KEY is missing',
        );
        return;
    }

    const user = await auth.getUser(uid);
    if (!user.email) {
        logger.warn('Skipping sign-in alert email because user has no email', { uid });
        return;
    }

    const appUserDocSnap = await db.collection('users').doc(user.email).get();
    const appUserDoc = appUserDocSnap.data() as AppUserDoc | undefined;
    const securityEmailsEnabled = appUserDoc?.emailPreferences?.security === true;
    if (!securityEmailsEnabled) {
        const emailHash = createHash('sha256').update(user.email).digest('hex');
        logger.info('Skipping sign-in alert email because security emails are disabled', {
            uid,
            emailHash,
        });
        return;
    }

    const signedInAt = new Date().toISOString();
    const safeName = escapeHtml(user.displayName || user.email);
    const safeSignedInAt = escapeHtml(signedInAt);
    const safeIpAddress = escapeHtml(details.ipAddress);
    const safeOrigin = escapeHtml(details.origin);
    const safeUserAgent = escapeHtml(details.userAgent);
    const safeCredentialId = escapeHtml(details.credentialId);
    const text = [
        `Hi ${user.displayName || user.email},`,
        '',
        'We detected a sign-in from a new device on your CheFu Academy account.',
        '',
        `Time (UTC): ${signedInAt}`,
        `IP address: ${details.ipAddress}`,
        `Origin: ${details.origin}`,
        `Device: ${details.userAgent}`,
        `Credential: ${details.credentialId}`,
        '',
        'If this was not you, secure your account immediately.',
    ].join('\n');

    const html = `
        <p>Hi ${safeName},</p>
        <p>We detected a new sign-in to your CheFu Academy account.</p>
        <ul>
            <li><strong>Time (UTC):</strong> ${safeSignedInAt}</li>
            <li><strong>IP address:</strong> ${safeIpAddress}</li>
            <li><strong>Origin:</strong> ${safeOrigin}</li>
            <li><strong>Device:</strong> ${safeUserAgent}</li>
            <li><strong>Credential:</strong> ${safeCredentialId}</li>
        </ul>
        <p>If this was not you, secure your account immediately.</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: SIGNIN_ALERT_FROM,
            to: [user.email],
            subject: `New device sign-in to ${RP_NAME}`,
            text,
            html,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Resend request failed: ${response.status} ${errorBody}`);
    }
};

// API schema
const BodySchema = z.object({
    operation: z.enum([
        'reg-options',
        'reg-verify',
        'has-passkeys',
        'authn-options',
        'authn-verify',
    ]),
    uid: z.string().min(1),
    username: z.string().optional(), // for registration
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
                if (req.method === 'OPTIONS') {
                    return res.status(204).send('');
                }

                if (req.method !== 'POST') {
                    return res.status(405).send('Method Not Allowed');
                }

                const parsed = BodySchema.safeParse(req.body);
                if (!parsed.success) {
                    return res.status(400).json({ error: 'invalid-request' });
                }
                const { operation, uid, username, response } = parsed.data;
                const resolvedUid = await resolveUid(uid);

                const expectedOrigin = (req.headers.origin as string) || '';
                ensureOrigin(expectedOrigin);

                // Decide RPID
                const forwardedHost =
                    ((req.headers['x-forwarded-host'] as string | undefined) ||
                        req.headers.host ||
                        '')
                        .split(',')[0]
                        .trim()
                        .toLowerCase();
                let originHost = '';
                try {
                    originHost = new URL(expectedOrigin).hostname.toLowerCase();
                } catch {
                    originHost = '';
                }
                const effectiveRPID =
                    (originHost || RP_ID || forwardedHost.split(':')[0] || '')
                        .trim()
                        .toLowerCase();
                if (!effectiveRPID) {
                    return res.status(500).json({ error: 'rp-id-not-configured' });
                }

                // Load and normalize user doc to avoid crashes on legacy/partial records
                const loadedUserDoc = await getUserDoc(resolvedUid);
                const userDoc: WebAuthnUserDoc = {
                    username: loadedUserDoc?.username || username || resolvedUid,
                    challenge: loadedUserDoc?.challenge,
                    credentials: Array.isArray(loadedUserDoc?.credentials)
                        ? loadedUserDoc.credentials
                        : [],
                    signInDevices: Array.isArray(loadedUserDoc?.signInDevices)
                        ? loadedUserDoc.signInDevices
                        : [],
                };

                if (operation === 'reg-options') {
                    const idToken = getBearerToken(
                        req.headers.authorization as string | undefined,
                    );
                    if (!idToken) {
                        return res.status(401).json({ error: 'auth-required' });
                    }
                    const decoded = await auth.verifyIdToken(idToken);
                    if (decoded.uid !== resolvedUid) {
                        return res.status(403).json({ error: 'forbidden' });
                    }

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
                        userID: Buffer.from(resolvedUid),
                        authenticatorSelection: {
                            // let the client attachment be flexible; you already chose defaults in UI
                            residentKey: 'preferred',
                            requireResidentKey: false,
                        },
                        excludeCredentials,
                    });

                    await setUserDoc(resolvedUid, {
                        challenge: options.challenge,
                        username: userDoc.username,
                    });
                    return res.status(200).json({ options });
                }

                if (operation === 'reg-verify') {
                    const idToken = getBearerToken(
                        req.headers.authorization as string | undefined,
                    );
                    if (!idToken) {
                        return res.status(401).json({ error: 'auth-required' });
                    }
                    const decoded = await auth.verifyIdToken(idToken);
                    if (decoded.uid !== resolvedUid) {
                        return res.status(403).json({ error: 'forbidden' });
                    }

                    const cred = response as RegistrationResponseJSON;
                    if (!userDoc.challenge) {
                        return res.status(400).json({
                            error: 'missing stored challenge for verification',
                        });
                    }
                    const expectedChallenge = userDoc.challenge;
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
                        webauthnUserID: Buffer.from(resolvedUid).toString('base64url'),
                    };

                    await setUserDoc(resolvedUid, {
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

                    await setUserDoc(resolvedUid, { challenge: options.challenge });
                    return res.status(200).json({ options });
                }

                if (operation === 'has-passkeys') {
                    return res
                        .status(200)
                        .json({ enrolled: userDoc.credentials.length > 0 });
                }

                if (operation === 'authn-verify') {
                    const cred = response as AuthenticationResponseJSON;
                    if (!userDoc.challenge) {
                        return res.status(400).json({
                            error: 'missing stored challenge for verification',
                        });
                    }
                    const expectedChallenge = userDoc.challenge;

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

                    const origin = expectedOrigin;
                    const userAgent = getUserAgent(req);
                    const ipAddress = getClientIp(req);
                    const credentialId = cred.rawId;
                    const nowIso = new Date().toISOString();
                    const deviceKey = createDeviceFingerprint({
                        credentialId,
                        origin,
                    });
                    const existingDevice = userDoc.signInDevices?.find(
                        (d) => d.key === deviceKey,
                    );

                    const updatedDevices = existingDevice
                        ? userDoc.signInDevices!.map((d) =>
                              d.key === deviceKey
                                  ? {
                                        ...d,
                                        lastSeenAt: nowIso,
                                        lastIpAddress: ipAddress,
                                    }
                                  : d,
                          )
                        : [
                              ...(userDoc.signInDevices || []),
                              {
                                  key: deviceKey,
                                  label: userAgent,
                                  firstSeenAt: nowIso,
                                  lastSeenAt: nowIso,
                                  lastIpAddress: ipAddress,
                                  credentialId,
                                  origin,
                              },
                          ];

                    await setUserDoc(resolvedUid, {
                        challenge: null,
                        credentials: userDoc.credentials,
                        signInDevices: updatedDevices,
                    });

                    if (!existingDevice) {
                        void sendNewDeviceAlertEmail(resolvedUid, {
                            origin,
                            credentialId,
                            ipAddress,
                            userAgent,
                        }).catch((error: unknown) => {
                            logger.error('Failed to send sign-in alert email', error);
                        });
                    }

                    // Sign into Firebase: mint custom token for this uid
                    const token = await auth.createCustomToken(resolvedUid);
                    return res
                        .status(200)
                        .json({ verified: true, customToken: token });
                }

                return res.status(400).json({ error: 'unknown-operation' });
            } catch (err: unknown) {
                logger.error('webauthnApi error', err);
                const message = (err as Error)?.message || '';
                if (/user-not-registered/i.test(message)) {
                    return res.status(404).json({ error: 'user-not-registered' });
                }
                return res
                    .status(500)
                    .json({ error: 'internal', message: 'Internal server error' });
            }
        });
    },
);
