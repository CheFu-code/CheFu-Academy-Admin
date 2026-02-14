// client/src/passkeys.ts
import {
    startRegistration,
    startAuthentication,
    browserSupportsWebAuthn,
    platformAuthenticatorIsAvailable,
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';
import { signInWithCustomToken, UserCredential } from 'firebase/auth';
import { auth } from './firebase'; // your initialized client SDK

// Preferred: explicit endpoint for all environments.
// Fallbacks:
// 1) local dev direct function URL
// 2) Firebase Hosting rewrite path
const API = (
    process.env.NEXT_PUBLIC_WEBAUTHN_API_URL ||
    (process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        ? 'https://us-central1-' +
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID +
          '.cloudfunctions.net/webauthnApi'
        : '/firebase-web-authn-api')
).replace(/\/+$/, '');

// ---------- Utils ----------
async function post<T = unknown>(
    operation: string,
    body: Record<string, unknown>,
    authToken?: string,
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;

    const res = await fetch(API, {
        method: 'POST',
        headers,
        // Include the operation key expected by our backend
        body: JSON.stringify({ operation, ...body }),
        credentials: 'omit', // cross-origin function call in local dev; no cookies needed
    });

    if (!res.ok) {
        // Try to surface a meaningful error to the UI
        let message = `Request failed with status ${res.status}`;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const json = await res
                .json()
                .catch(() => undefined) as
                | { error?: string; message?: string }
                | undefined;
            message = json?.error || json?.message || message;
        } else {
            const text = await res.text().catch(() => '');
            message = text || message;
        }
        throw new Error(message);
    }
    return res.json();
}

/**
 * Quick capability checks for gating UI.
 */
export async function isPasskeyReady(): Promise<boolean> {
    if (!browserSupportsWebAuthn()) return false;
    try {
        return await platformAuthenticatorIsAvailable();
    } catch {
        // Non-fatal; some environments don't expose this properly
        return true;
    }
}

// ---------- Types for server responses ----------
type RegistrationOptionsResponse = {
    options: PublicKeyCredentialCreationOptionsJSON;
};
type AuthenticationOptionsResponse = {
    options: PublicKeyCredentialRequestOptionsJSON;
};
type VerifyRegResponse = { verified: boolean };
type VerifyAuthnResponse = { verified: boolean; customToken?: string };
type HasPasskeysResponse = { enrolled: boolean };

// ---------- Registration ----------
/**
 * Registers a new passkey for the account.
 * @param uid - Your app’s stable user identifier (string).
 * @param username - A friendly label for the credential (shown in passkey managers).
 * @returns boolean indicating if registration verified successfully.
 *
 * Typical usage:
 *   // user already signed in (email/Google/etc.)
 *   const ok = await registerPasskey(currentUser.uid, currentUser.email ?? 'CheFu');
 */
export async function registerPasskey(
    uid: string,
    username: string,
): Promise<boolean> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error('Sign in first to enroll a passkey.');
    }
    const idToken = await currentUser.getIdToken();

    // 1) Get registration options from server
    const { options } = await post<RegistrationOptionsResponse>('reg-options', {
        uid,
        username,
    }, idToken);

    // 2) Trigger WebAuthn ceremony in the browser
    const attestation = await startRegistration({ optionsJSON: options });

    // 3) Send result back to server for verification + storage
    const { verified } = await post<VerifyRegResponse>('reg-verify', {
        uid,
        response: attestation,
    }, idToken);

    return verified;
}

export async function hasEnrolledPasskey(uid: string): Promise<boolean> {
    const { enrolled } = await post<HasPasskeysResponse>('has-passkeys', {
        uid,
    });
    return enrolled;
}

// ---------- Authentication (Sign in) ----------
/**
 * Signs a user in using a previously-registered passkey.
 * @param uid - The same user identifier you used during registration.
 * @returns Firebase UserCredential after successful sign-in.
 *
 * Typical usage:
 *   const userCred = await signInWithPasskey(emailOrUid);
 */
export async function signInWithPasskey(uid: string): Promise<UserCredential> {
    // 1) Get authentication options from server
    const { options } = await post<AuthenticationOptionsResponse>(
        'authn-options',
        {
            uid,
        },
    );

    // 2) Trigger WebAuthn authentication ceremony
    const assertion = await startAuthentication({ optionsJSON: options });

    // 3) Server verifies assertion and returns a Firebase custom token
    const { verified, customToken } = await post<VerifyAuthnResponse>(
        'authn-verify',
        {
            uid,
            response: assertion,
        },
    );

    if (!verified || !customToken) {
        throw new Error(
            'Passkey authentication failed (verification or token missing).',
        );
    }

    // 4) Sign the user into Firebase with the custom token
    return signInWithCustomToken(auth, customToken);
}

// ---------- Optional UX Helpers ----------
/**
 * A friendly error -> message mapper you can use in UI.
 */
export function toPasskeyMessage(err: unknown): string {
    const msg = (err as Error)?.message || 'Unknown error';
    if (/no-passkeys-enrolled/i.test(msg))
        return 'No passkey is enrolled for this account yet.';
    if (/NotAllowedError|AbortError/i.test(msg))
        return 'Passkey prompt was cancelled.';
    if (/invalid|mismatch|challenge|origin|rp/i.test(msg))
        return 'Passkey could not be verified.';
    if (/credential-not-found/i.test(msg))
        return 'No passkey was found for this account.';
    return msg;
}

export async function signInWithFirebasePasskey(uid: string) {
    return signInWithPasskey(uid);
}



