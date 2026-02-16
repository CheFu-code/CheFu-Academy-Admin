import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (getApps().length === 0) {
    initializeApp();
}

export const db = getFirestore();
export const auth = getAuth();
export const USERS = db.collection('webauthnUsers');

export const RP_NAME = process.env.RP_NAME || 'CheFu Academy';
export const RP_ID = process.env.RP_ID || undefined;
export const SIGNIN_ALERT_FROM = process.env.SIGNIN_ALERT_FROM || '';
export const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
export const SIGNIN_ALERT_TEMPLATE_ID = process.env.SIGNIN_ALERT_TEMPLATE_ID || '';
export const PASSKEY_ADDED_TEMPLATE_ID = process.env.PASSKEY_ADDED_TEMPLATE_ID || '';
export const PASSKEY_ADDED_FROM = process.env.PASSKEY_ADDED_FROM || SIGNIN_ALERT_FROM;
export const PASSKEY_ADDED_SECURITY_URL =
    process.env.PASSKEY_ADDED_SECURITY_URL || 'https://academy.chefuinc.com/settings/account';
export const PASSKEY_ADDED_SUPPORT_EMAIL =
    process.env.PASSKEY_ADDED_SUPPORT_EMAIL || 'support@chefuinc.com';
export const SIGNIN_ALERT_PASSWORD_CHANGE_URL =
    process.env.SIGNIN_ALERT_PASSWORD_CHANGE_URL ||
    'https://academy.chefuinc.com/settings/account';
export const ALLOW_VERCEL_PREVIEWS = process.env.WEBAUTHN_ALLOW_VERCEL_PREVIEWS === 'true';
const ALLOW_LOCALHOST =
    process.env.WEBAUTHN_ALLOW_LOCALHOST === 'true' ||
    process.env.ALLOW_LOCALHOST === 'true' ||
    process.env.NODE_ENV !== 'production';

const defaultOrigins = [
    'https://cheforumreal.web.app',
    'https://academy.chefuinc.com',
];
if (ALLOW_LOCALHOST) {
    defaultOrigins.push('http://localhost:3000');
}
const envOrigins = (process.env.WEBAUTHN_ALLOWED_ORIGINS || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
export const ORIGINS = new Set<string>([...defaultOrigins, ...envOrigins]);
