// authMfaTotp.ts
import {
    getMultiFactorResolver,
    TotpMultiFactorGenerator,
    MultiFactorError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * Completes MFA using a TOTP factor only.
 * - `error` is the MultiFactorError thrown by first-factor sign-in (e.g., Google popup).
 * - `getCode` is a function that returns a 6-digit code (from a modal/input of your choice).
 */
export async function completeMfaWithTotp(
    error: MultiFactorError,
    getCode: () => Promise<string>,
) {
    const resolver = getMultiFactorResolver(auth, error);
    const totpHint = resolver.hints.find(
        (h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID,
    );
    if (!totpHint) {
        throw new Error('No TOTP factor enrolled on this account.');
    }

    // Ask the user for the current code from their authenticator app
    const code = (await getCode()).trim();
    if (!/^\d{6}$/.test(code)) {
        throw new Error('Please enter a valid 6‑digit TOTP code.');
    }

    // Create the assertion and finish sign-in
    const assertion = TotpMultiFactorGenerator.assertionForSignIn(
        totpHint.uid, // enrollmentId
        code, // oneTimePassword
    );
    return resolver.resolveSignIn(assertion);
}
