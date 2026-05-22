import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';
import {
    SESSION_META_COOKIE_NAME,
    type SessionMeta,
} from '@/lib/session-constants';

function getSigningSecret() {
    return (
        process.env.AUTH_SESSION_SECRET ||
        process.env.SESSION_COOKIE_SECRET ||
        process.env.FIREBASE_SERVICE_ACCOUNT ||
        ''
    );
}

function verifySessionMeta(value?: string): SessionMeta | null {
    const [payload, signature] = value?.split('.') || [];
    const secret = getSigningSecret();

    if (!payload || !signature || !secret) return null;

    const expected = createHmac('sha256', secret)
        .update(payload)
        .digest('base64url');
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (
        actualBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
        return null;
    }

    const meta = JSON.parse(
        Buffer.from(payload, 'base64url').toString('utf8'),
    ) as SessionMeta;

    if (!meta.exp || meta.exp <= Math.floor(Date.now() / 1000)) {
        return null;
    }

    return meta;
}

export async function getServerSessionMeta() {
    const cookieStore = await cookies();
    return verifySessionMeta(cookieStore.get(SESSION_META_COOKIE_NAME)?.value);
}
