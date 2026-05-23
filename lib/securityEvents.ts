import { auth, db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export type SecurityEventType =
    | 'sign_in'
    | 'password_changed'
    | 'passkey_enrolled'
    | 'mfa_enabled'
    | 'mfa_disabled'
    | 'verification_email_sent';

export async function logSecurityEvent(
    type: SecurityEventType,
    details: Record<string, unknown> = {},
) {
    const currentUser = auth.currentUser;
    const email = currentUser?.email;
    if (!email) return;

    await addDoc(collection(db, 'users', email, 'securityEvents'), {
        type,
        details,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        createdAt: serverTimestamp(),
    });
}
