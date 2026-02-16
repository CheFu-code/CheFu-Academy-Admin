import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { normalizeFromAddress } from './emailUtils';
import {
    PASSKEY_ADDED_SUPPORT_EMAIL,
    RESEND_API_KEY,
    RP_NAME,
    SIGNIN_ALERT_FROM,
    auth,
} from './webauthn/config';
import {
    applyCorsHeaders,
    areSecurityEmailsEnabled,
    getBearerToken,
    getClientIp,
    getUserAgent,
    normalizeActionUrl,
} from './webauthn/helpers';

const PASSWORD_CHANGED_TEMPLATE_ID = process.env.PASSWORD_CHANGED_TEMPLATE_ID || '';
const PASSWORD_CHANGED_FROM = process.env.PASSWORD_CHANGED_FROM || SIGNIN_ALERT_FROM;
const PASSWORD_CHANGED_SECURITY_URL =
    process.env.PASSWORD_CHANGED_SECURITY_URL || 'https://academy.chefuinc.com/settings/account';
const PASSWORD_CHANGED_SUPPORT_EMAIL =
    process.env.PASSWORD_CHANGED_SUPPORT_EMAIL || PASSKEY_ADDED_SUPPORT_EMAIL;

export const sendPasswordChangedEmail = onRequest(
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

            const idToken = getBearerToken(req.headers.authorization as string | undefined);
            if (!idToken) {
                return void res.status(401).json({ error: 'auth-required' });
            }
            const decoded = await auth.verifyIdToken(idToken);
            const user = await auth.getUser(decoded.uid);
            if (!user.email) {
                return void res.status(400).json({ error: 'email-missing' });
            }

            const fromAddress = normalizeFromAddress(PASSWORD_CHANGED_FROM);
            if (!fromAddress || !RESEND_API_KEY || !PASSWORD_CHANGED_TEMPLATE_ID) {
                logger.warn(
                    'PASSWORD_CHANGED_FROM is invalid (or missing), RESEND_API_KEY is missing, or PASSWORD_CHANGED_TEMPLATE_ID is missing',
                );
                return void res.status(500).json({ error: 'email-config-missing' });
            }

            const enabled = await areSecurityEmailsEnabled(user.email);
            if (!enabled) {
                return void res.status(200).json({ sent: false, reason: 'security-emails-disabled' });
            }

            const changedAt = new Date().toISOString();
            const ipAddress = getClientIp(req);
            const userAgent = getUserAgent(req);
            const securityUrl =
                normalizeActionUrl(PASSWORD_CHANGED_SECURITY_URL) ||
                'https://academy.chefuinc.com/settings/account';

            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: fromAddress,
                    to: [user.email],
                    subject: `Password changed for ${RP_NAME}`,
                    template: {
                        id: PASSWORD_CHANGED_TEMPLATE_ID,
                        variables: {
                            USER_NAME: user.displayName || user.email,
                            CHANGED_AT: changedAt,
                            IP_ADDRESS: ipAddress,
                            USER_AGENT: userAgent,
                            SECURITY_URL: securityUrl,
                            SUPPORT_EMAIL: PASSWORD_CHANGED_SUPPORT_EMAIL,
                            APP_NAME: RP_NAME,
                            YEAR: new Date().getUTCFullYear().toString(),
                        },
                    },
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                logger.error('Password-changed email send failed', {
                    uid: decoded.uid,
                    status: response.status,
                    errorBody,
                });
                return void res.status(502).json({ error: 'email-send-failed' });
            }

            return void res.status(200).json({ sent: true });
        } catch (error: unknown) {
            logger.error('sendPasswordChangedEmail error', error);
            return void res.status(500).json({ error: 'internal' });
        }
    },
);

