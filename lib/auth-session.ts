export {
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
    SESSION_META_COOKIE_NAME,
    type SessionMeta,
} from '@/lib/session-constants';

import type { SessionMeta } from '@/lib/session-constants';

function getSigningSecret() {
    const secret =
        process.env.AUTH_SESSION_SECRET ||
        process.env.SESSION_COOKIE_SECRET ||
        process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!secret) {
        throw new Error('AUTH_SESSION_SECRET is not configured');
    }

    return secret;
}

function base64UrlEncode(value: string | Uint8Array) {
    const input =
        typeof value === 'string' ? Buffer.from(value, 'utf8') : Buffer.from(value);

    return input
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

export async function signSessionMeta(meta: SessionMeta) {
    const crypto = await import('crypto');
    const payload = base64UrlEncode(JSON.stringify(meta));
    const signature = crypto
        .createHmac('sha256', getSigningSecret())
        .update(payload)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');

    return `${payload}.${signature}`;
}
