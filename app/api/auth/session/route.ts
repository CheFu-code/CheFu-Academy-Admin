import {
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE_SECONDS,
    SESSION_META_COOKIE_NAME,
    SessionMeta,
    signSessionMeta,
} from '@/lib/auth-session';
import { getFirebaseAdminApp, getFirebaseAdminDb } from '@/lib/firebase-admin';
import admin from 'firebase-admin';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function getCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
    };
}

async function getUserRoles(email?: string) {
    if (!email) return [];

    const snapshot = await getFirebaseAdminDb()
        .collection('users')
        .doc(email)
        .get();

    const roles = snapshot.data()?.roles;
    return Array.isArray(roles) ? roles.map(String) : [];
}

export async function POST(req: Request) {
    try {
        const authorization = req.headers.get('authorization') || '';
        const idToken = authorization.startsWith('Bearer ')
            ? authorization.slice('Bearer '.length)
            : '';

        if (!idToken) {
            return NextResponse.json(
                { error: 'Missing Firebase ID token' },
                { status: 401 },
            );
        }

        const adminApp = getFirebaseAdminApp();
        const decodedToken = await admin.auth(adminApp).verifyIdToken(idToken);
        const expiresIn = SESSION_MAX_AGE_SECONDS * 1000;
        const sessionCookie = await admin
            .auth(adminApp)
            .createSessionCookie(idToken, { expiresIn });

        const roles = await getUserRoles(decodedToken.email);
        const meta: SessionMeta = {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            roles,
            exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
        };

        const response = NextResponse.json({ ok: true });
        const cookieOptions = getCookieOptions();

        response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, cookieOptions);
        response.cookies.set(
            SESSION_META_COOKIE_NAME,
            await signSessionMeta(meta),
            cookieOptions,
        );

        return response;
    } catch (error) {
        console.error('[Auth Session] Failed to create session:', error);
        return NextResponse.json(
            { error: 'Failed to create session' },
            { status: 401 },
        );
    }
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    const expiredOptions = {
        ...getCookieOptions(),
        maxAge: 0,
    };

    response.cookies.set(SESSION_COOKIE_NAME, '', expiredOptions);
    response.cookies.set(SESSION_META_COOKIE_NAME, '', expiredOptions);

    return response;
}
