import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
    RegistrationResponseJSON,
    AuthenticationResponseJSON,
} from '@simplewebauthn/server';
import { z } from 'zod';
import { auth, RP_ID, RP_NAME } from './webauthn/config';
import { sendPasskeyAddedEmail, sendSignInAlertEmail } from './webauthn/emails';
import {
    applyCorsHeaders,
    createDeviceFingerprint,
    ensureOrigin,
    getBearerToken,
    getClientIp,
    getUserAgent,
    getUserDoc,
    resolveUid,
    setUserDoc,
} from './webauthn/helpers';
import type { Passkey, WebAuthnUserDoc } from './webauthn/types';

const BodySchema = z.object({
    operation: z.enum([
        'reg-options',
        'reg-verify',
        'has-passkeys',
        'authn-options',
        'authn-verify',
    ]),
    uid: z.string().min(1),
    username: z.string().optional(),
    response: z.any().optional(),
});

export const webauthnApi = onRequest(
    {
        region: 'us-central1',
        cors: false,
    },
    async (req, res) => {
        try {
            if (!applyCorsHeaders(req, res)) {
                return void res.status(403).json({ error: 'origin-not-allowed' });
            }
            if (req.method === 'OPTIONS') {
                return void res.status(204).send('');
            }
            if (req.method !== 'POST') {
                return void res.status(405).send('Method Not Allowed');
            }

            const parsed = BodySchema.safeParse(req.body);
            if (!parsed.success) {
                return void res.status(400).json({ error: 'invalid-request' });
            }
            const { operation, uid, username, response } = parsed.data;
            const resolvedUid = await resolveUid(uid);

            const expectedOrigin = (req.headers.origin as string) || '';
            ensureOrigin(expectedOrigin);

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
                return void res.status(500).json({ error: 'rp-id-not-configured' });
            }

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
                const idToken = getBearerToken(req.headers.authorization as string | undefined);
                if (!idToken) {
                    return void res.status(401).json({ error: 'auth-required' });
                }
                const decoded = await auth.verifyIdToken(idToken);
                if (decoded.uid !== resolvedUid) {
                    return void res.status(403).json({ error: 'forbidden' });
                }

                const excludeCredentials = userDoc.credentials.map((cred) => ({
                    id: cred.id,
                    type: 'public-key' as const,
                    transports: cred.transports,
                }));

                const options = await generateRegistrationOptions({
                    rpName: RP_NAME,
                    rpID: effectiveRPID,
                    userName: userDoc.username,
                    userID: Buffer.from(resolvedUid),
                    authenticatorSelection: {
                        residentKey: 'preferred',
                        requireResidentKey: false,
                    },
                    excludeCredentials,
                });

                await setUserDoc(resolvedUid, {
                    challenge: options.challenge,
                    username: userDoc.username,
                });
                return void res.status(200).json({ options });
            }

            if (operation === 'reg-verify') {
                const idToken = getBearerToken(req.headers.authorization as string | undefined);
                if (!idToken) {
                    return void res.status(401).json({ error: 'auth-required' });
                }
                const decoded = await auth.verifyIdToken(idToken);
                if (decoded.uid !== resolvedUid) {
                    return void res.status(403).json({ error: 'forbidden' });
                }

                const cred = response as RegistrationResponseJSON;
                if (!userDoc.challenge) {
                    return void res.status(400).json({
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

                if (!verification.verified || !verification.registrationInfo) {
                    return void res.status(400).json({ verified: false });
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
                        ...userDoc.credentials.filter((c) => c.id !== newPasskey.id),
                        newPasskey,
                    ],
                });

                const origin = expectedOrigin;
                const userAgent = getUserAgent(req);
                const ipAddress = getClientIp(req);
                const addedAt = new Date().toISOString();
                void sendPasskeyAddedEmail(resolvedUid, {
                    origin,
                    ipAddress,
                    userAgent,
                    addedAt,
                }).catch((error: unknown) => {
                    logger.error('Failed to send passkey-added email', error);
                });

                return void res.status(200).json({ verified: true });
            }

            if (operation === 'authn-options') {
                if (userDoc.credentials.length === 0) {
                    return void res.status(404).json({ error: 'no-passkeys-enrolled' });
                }

                const allowCredentials = userDoc.credentials.map((cred) => ({
                    id: cred.id,
                    type: 'public-key' as const,
                    transports: cred.transports,
                }));

                const options = await generateAuthenticationOptions({
                    rpID: effectiveRPID,
                    allowCredentials,
                    userVerification: 'preferred',
                });

                await setUserDoc(resolvedUid, { challenge: options.challenge });
                return void res.status(200).json({ options });
            }

            if (operation === 'has-passkeys') {
                return void res.status(200).json({ enrolled: userDoc.credentials.length > 0 });
            }

            if (operation === 'authn-verify') {
                const cred = response as AuthenticationResponseJSON;
                if (!userDoc.challenge) {
                    return void res.status(400).json({
                        error: 'missing stored challenge for verification',
                    });
                }
                const expectedChallenge = userDoc.challenge;

                const credID = cred.rawId;
                const match = userDoc.credentials.find((c) => c.id === credID);
                if (!match) {
                    return void res.status(404).json({ error: 'credential-not-found' });
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

                if (!verification.verified || !verification.authenticationInfo) {
                    return void res.status(401).json({ verified: false });
                }

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
                const existingDevice = userDoc.signInDevices?.find((d) => d.key === deviceKey);

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

                void sendSignInAlertEmail(resolvedUid, {
                    origin,
                    credentialId,
                    ipAddress,
                    userAgent,
                }).catch((error: unknown) => {
                    logger.error('Failed to send sign-in alert email', error);
                });

                const token = await auth.createCustomToken(resolvedUid);
                return void res.status(200).json({ verified: true, customToken: token });
            }

            return void res.status(400).json({ error: 'unknown-operation' });
        } catch (err: unknown) {
            logger.error('webauthnApi error', err);
            const message = (err as Error)?.message || '';
            if (/user-not-registered/i.test(message)) {
                return void res.status(404).json({ error: 'user-not-registered' });
            }
            return void res.status(500).json({ error: 'internal', message: 'Internal server error' });
        }
    },
);

