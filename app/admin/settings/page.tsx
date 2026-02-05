'use client';

import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import {
    EmailAuthProvider,
    getMultiFactorResolver,
    GoogleAuthProvider,
    multiFactor,
    MultiFactorError,
    onAuthStateChanged,
    onIdTokenChanged,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    TotpMultiFactorGenerator,
    TotpSecret,
} from 'firebase/auth';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SystemSettingUI from '../_components/UI/Settings/SystemSettingUI';

const SystemSettings = () => {
    const [admin2FA, setAdmin2FA] = useState(false);
    const [ipAccessRange, setIpAccessRange] = useState('');
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [twoFACode, setTwoFACode] = useState('');
    const [totpSecret, setTotpSecret] = useState<TotpSecret | null>(null);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [secretText, setSecretText] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mfaKnown, setMfaKnown] = useState(false);

    useEffect(() => {
        const computeMfa = (user: typeof auth.currentUser) => {
            if (!user) {
                setAdmin2FA(false);
                setMfaKnown(true);
                return;
            }
            const enrolled = multiFactor(user).enrolledFactors.some(
                (f) => f.factorId === TotpMultiFactorGenerator.FACTOR_ID,
            );
            setAdmin2FA(enrolled);
            setMfaKnown(true);
        };

        const unSubAuth = onAuthStateChanged(auth, (user) => computeMfa(user));
        const unSubToken = onIdTokenChanged(auth, (user) => computeMfa(user));

        return () => {
            unSubAuth();
            unSubToken();
        };
    }, []);

    const reauthIfNeeded = async () => {
        const user = auth.currentUser;
        if (!user) throw new Error('No logged-in user.');

        const providerId = user.providerData[0]?.providerId;

        try {
            if (providerId === 'password') {
                const password = prompt('Please re-enter your password:');
                if (!password) throw new Error('Password required.');
                if (!user.email) throw new Error('Missing email.');
                const cred = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, cred);
                return;
            }
            if (providerId === 'google.com') {
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);
                return;
            }
        } catch (error) {
            const fbError = error as FirebaseError;

            if (fbError.code === 'auth/multi-factor-auth-required') {
                // Get the resolver for this MFA challenge
                const resolver = getMultiFactorResolver(
                    auth,
                    fbError as unknown as MultiFactorError,
                );

                // Pick the TOTP factor (or let the user choose among resolver.hints)
                const totpHint = resolver.hints.find(
                    (h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID,
                );
                if (!totpHint) {
                    throw new Error('No TOTP factor enrolled on this account.');
                }

                // Prompt for the CURRENT code from the authenticator app
                const code = prompt(
                    'Enter the 6‑digit code from your authenticator app:',
                );
                if (!code) throw new Error('TOTP code required.');

                const assertion = TotpMultiFactorGenerator.assertionForSignIn(
                    totpHint.uid,
                    code,
                );
                await resolver.resolveSignIn(assertion);
                await auth.currentUser?.getIdToken(true);
                return;
            }
            console.error('error', error);

            if (
                fbError.code === 'auth/account-exists-with-different-credential'
            ) {
                toast.error('Account exists with different credential');
            } else if (fbError.code === 'auth/popup-closed-by-user') {
                toast.error('Popup closed by user');
            } else if (fbError.code === 'auth/cancelled-popup-request') {
                toast.error('Cancelled popup request');
            } else if (fbError.code === 'auth/user-token-expired') {
                toast.error('User token expired');
            } else if (fbError.code === 'auth/invalid-credential') {
                toast.error('Invalid credential');
            } else if (fbError.code === 'auth/requires-recent-login') {
                toast.error('Requires recent login');
            } else {
                toast.error(fbError.message);
            }
            throw error;
        }
    };

    const startTotpSetup = async () => {
        setLoading(true);
        try {
            await reauthIfNeeded();

            const u = auth.currentUser!;
            const session = await multiFactor(u).getSession(); // MFA session
            const secret =
                await TotpMultiFactorGenerator.generateSecret(session);

            // Build QR URI & image
            if (!u.email) {
                throw new Error(
                    'Email is required to generate the TOTP QR code.',
                );
            }
            const uri = secret.generateQrCodeUrl(u.email, 'CheFu Academy'); // show in authenticator
            const dataUrl = await QRCode.toDataURL(uri);

            setTotpSecret(secret);
            setQrDataUrl(dataUrl);
            setSecretText(secret.secretKey); // fallback text for authenticator apps
            setShow2FAModal(true);
        } catch (e) {
            toast.error('Failed to start TOTP setup');
            console.error('Failed to start TOTP setup', e);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify2FA = async () => {
        if (!totpSecret || twoFACode.length !== 6) return;
        setLoading(true);
        try {
            const assertion = TotpMultiFactorGenerator.assertionForEnrollment(
                totpSecret,
                twoFACode,
            );
            await multiFactor(auth.currentUser!).enroll(
                assertion,
                'Admin TOTP',
            );
            await auth.currentUser?.reload();
            setAdmin2FA(true);
            toast.success('2FA enabled');
            setShow2FAModal(false);
            setTwoFACode('');
            setTotpSecret(null);
            setQrDataUrl(null);
            setSecretText(null);
        } catch (error) {
            let message = 'An unexpected error occurred during verification.';

            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/invalid-verification-code':
                        message =
                            'The verification code you entered is invalid.';
                        break;

                    case 'auth/code-expired':
                        message =
                            'This code has expired. Authenticator codes refresh every 30 seconds.';
                        break;

                    case 'auth/requires-recent-login':
                        message =
                            'You must re‑authenticate before enabling 2FA. Please sign in again.';
                        break;

                    case 'auth/too-many-requests':
                        message =
                            'Too many attempts. Please wait a moment before trying again.';
                        break;

                    case 'auth/too-many-enrollment-attempts':
                        message =
                            'Too many attempts. Please wait a moment before trying again.';
                        break;

                    case 'auth/multi-factor-info-not-found':
                        message =
                            'Unable to verify MFA information. Please restart the TOTP setup.';
                        break;

                    default:
                        message = error.message; // safe, strongly typed
                        break;
                }
            }

            toast.error(message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const disableTotp = async () => {
        setLoading(true);
        try {
            await reauthIfNeeded();
            const u = auth.currentUser!;
            const mfaUser = multiFactor(u);
            const factor = mfaUser.enrolledFactors.find(
                (f) => f.factorId === TotpMultiFactorGenerator.FACTOR_ID,
            );
            if (factor) {
                await mfaUser.unenroll(factor.uid);
            }
            await auth.currentUser?.reload();
            setAdmin2FA(false);
            toast.success('2FA disabled');
        } catch (e) {
            if (
                e instanceof FirebaseError &&
                e.code === 'auth/requires-recent-login'
            ) {
                toast.error('Please re‑authenticate to disable 2FA.');
            } else {
                toast.error('Could not disable 2FA.');
            }
            console.error('Disable TOTP failed', e);
        } finally {
            setLoading(false);
        }
    };

    const onToggle2FA = async (enabled: boolean) => {
        if (enabled) {
            await startTotpSetup();
        } else {
            await disableTotp();
        }
    };

    return (
        <SystemSettingUI
            admin2FA={admin2FA}
            setAdmin2FA={setAdmin2FA}
            ipAccessRange={ipAccessRange}
            setIpAccessRange={setIpAccessRange}
            show2FAModal={show2FAModal}
            setShow2FAModal={setShow2FAModal}
            twoFACode={twoFACode}
            setTwoFACode={setTwoFACode}
            handleVerify2FA={handleVerify2FA}
            loading={loading}
            qrDataUrl={qrDataUrl}
            secretText={secretText}
            onToggle2FA={onToggle2FA}
            mfaKnown={mfaKnown}
        />
    );
};

export default SystemSettings;
