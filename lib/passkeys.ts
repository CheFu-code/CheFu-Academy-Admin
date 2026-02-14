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

// Same-origin endpoint via Firebase Hosting rewrite
// See firebase.json: { "source": "/firebase-web-authn-api", "function": "webauthnApi" }
const API =
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        ? 'https://us-central1-' +
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID +
          '.cloudfunctions.net/webauthnApi'
        : '/firebase-web-authn-api';

const getRpId = () => window.location.hostname;

// ---------- Utils ----------
async function post<T = unknown>(
    operation: string,
    body: Record<string, unknown>,
): Promise<T> {
    const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Include the operation key expected by our backend
        body: JSON.stringify({ operation, ...body }),
        credentials: 'omit', // cross-origin function call in local dev; no cookies needed
    });

    if (!res.ok) {
        // Try to surface a meaningful error to the UI
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed with status ${res.status}`);
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
    // 1) Get registration options from server
    const { options } = await post<RegistrationOptionsResponse>('reg-options', {
        uid,
        username,
        origin: window.location.origin, // the server validates this
        rpId: getRpId(),
    });

    // 2) Trigger WebAuthn ceremony in the browser
    const attestation = await startRegistration({ optionsJSON: options });

    // 3) Send result back to server for verification + storage
    const { verified } = await post<VerifyRegResponse>('reg-verify', {
        uid,
        origin: window.location.origin,
        rpId: getRpId(),
        response: attestation,
    });

    return verified;
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
            origin: window.location.origin,
            rpId: getRpId(),
        },
    );

    // 2) Trigger WebAuthn authentication ceremony
    const assertion = await startAuthentication({ optionsJSON: options });

    // 3) Server verifies assertion and returns a Firebase custom token
    const { verified, customToken } = await post<VerifyAuthnResponse>(
        'authn-verify',
        {
            uid,
            origin: window.location.origin,
            rpId: getRpId(),
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



