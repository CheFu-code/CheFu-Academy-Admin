import type { Request, Response } from 'express';
import { createHash } from 'node:crypto';
import { ALLOW_VERCEL_PREVIEWS, ORIGINS, USERS, auth, db } from './config';
import type { AppUserDoc, WebAuthnUserDoc } from './types';

export const isAllowedOrigin = (origin: string) => {
    if (ORIGINS.has(origin)) return true;
    if (!ALLOW_VERCEL_PREVIEWS) return false;
    try {
        const host = new URL(origin).hostname.toLowerCase();
        return host.endsWith('.vercel.app');
    } catch {
        return false;
    }
};

export const applyCorsHeaders = (req: Request, res: Response): boolean => {
    const origin = req.headers.origin;
    if (typeof origin !== 'string' || !origin) return true;
    if (!isAllowedOrigin(origin)) return false;

    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');
    return true;
};

export const areSecurityEmailsEnabled = async (email: string) => {
    const appUserDocSnap = await db.collection('users').doc(email).get();
    const appUserDoc = appUserDocSnap.data() as AppUserDoc | undefined;
    return appUserDoc?.emailPreferences?.security ?? true;
};

export const getUserDoc = async (uid: string) =>
    (await USERS.doc(uid).get()).data() as WebAuthnUserDoc | undefined;

export const setUserDoc = (uid: string, data: Partial<WebAuthnUserDoc>) =>
    USERS.doc(uid).set(data, { merge: true });

export const resolveUid = async (identifier: string): Promise<string> => {
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

export const ensureOrigin = (origin: string) => {
    if (!isAllowedOrigin(origin)) throw new Error(`Origin not allowed: ${origin}`);
    return origin;
};

export const getBearerToken = (authHeader?: string) => {
    if (!authHeader) return null;
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;
    return token;
};

export const getClientIp = (req: Request) => {
    const forwarded = req.headers['x-forwarded-for'];
    const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded || '';
    const firstForwardedIp = forwardedValue.split(',')[0]?.trim();
    return firstForwardedIp || req.ip || req.socket.remoteAddress || 'unknown';
};

export const getUserAgent = (req: Request) =>
    (req.headers['user-agent'] as string | undefined) || 'unknown';

export const createDeviceFingerprint = (details: {
    credentialId: string;
    origin: string;
}) =>
    createHash('sha256')
        .update(`${details.credentialId}|${details.origin}`)
        .digest('hex');

export const normalizeActionUrl = (raw: string): string | null => {
    const value = raw.trim();
    if (!value) return null;
    try {
        const parsed = new URL(value);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
            return null;
        }
        return parsed.toString();
    } catch {
        return null;
    }
};

