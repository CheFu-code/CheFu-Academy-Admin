// authMfaTotp.ts
import { getApiUrl } from '@/lib/api-url';
import { auth } from '@/lib/firebase';
import {
    getMultiFactorResolver,
    MultiFactorError,
    signInWithCustomToken,
    TotpMultiFactorGenerator,
} from 'firebase/auth';

export type MfaChallengeResponse = {
    code: string;
    method: 'totp' | 'backup';
};

function getMfaChallengeDetails(error: MultiFactorError) {
    const customData = (error as {
        customData?: {
            email?: string;
            _tokenResponse?: {
                email?: string;
                mfaPendingCredential?: string;
            };
        };
    }).customData;

    return {
        email: customData?.email || customData?._tokenResponse?.email || '',
        mfaPendingCredential: customData?._tokenResponse?.mfaPendingCredential || '',
    };
}

/**
 * Completes MFA using either the enrolled TOTP factor or a one-time backup code.
 */
export async function completeMfaWithTotp(
    error: MultiFactorError,
    getCode: () => Promise<MfaChallengeResponse>,
    fallbackEmail = '',
) {
    const resolver = getMultiFactorResolver(auth, error);
    const totpHint = resolver.hints.find(
        (h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID,
    );
    if (!totpHint) {
        throw new Error('No TOTP factor enrolled on this account.');
    }

    const challenge = await getCode();
    const code = challenge.code.trim();

    if (challenge.method === 'backup') {
        const { email, mfaPendingCredential } = getMfaChallengeDetails(error);
        const response = await fetch(getApiUrl('/auth/mfa/backup-code/session'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email || fallbackEmail,
                code,
                mfaPendingCredential,
            }),
        });
        const data = (await response.json().catch(() => ({}))) as {
            customToken?: string;
            message?: string;
        };

        if (!response.ok || !data.customToken) {
            throw new Error(data.message || 'Backup code recovery failed.');
        }

        return signInWithCustomToken(auth, data.customToken);
    }

    if (!/^\d{6}$/.test(code)) {
        throw new Error('Please enter a valid 6-digit TOTP code.');
    }

    const assertion = TotpMultiFactorGenerator.assertionForSignIn(
        totpHint.uid,
        code,
    );
    return resolver.resolveSignIn(assertion);
}
