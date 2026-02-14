'use client';
import { completeMfaWithTotp } from '@/helpers/authMfaTotp';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useEmailSignIn } from '@/hooks/useEmailSignIn';
import { auth } from '@/lib/firebase';
import { saveUser } from '@/services/authService';
import {
    GoogleAuthProvider,
    MultiFactorError,
    signInWithPopup
} from 'firebase/auth';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import LoginForm from './_components/LoginForm';
import SetupModal from '@/app/admin/_components/UI/Settings/SetupModal';

export default function LoginPage() {
    const { loading } = useAuthUser();
    const {
        handleEmailLogin,
        email,
        setEmail,
        password,
        setPassword,
        emailPending,
    } = useEmailSignIn();
    const [googlePending, setGooglePending] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [twoFACode, setTwoFACode] = useState('');
    const [mfaSubmitting, setMfaSubmitting] = useState(false);

    // to connect modal UI with the TOTP helper via a Promise
    const mfaResolveRef = useRef<((code: string) => void) | null>(null);
    const mfaRejectRef = useRef<((err?: unknown) => void) | null>(null);

    const getTotpCodeViaModal = () =>
        new Promise<string>((resolve, reject) => {
            setTwoFACode('');
            setShow2FAModal(true);
            mfaResolveRef.current = resolve;
            mfaRejectRef.current = reject;
        });

    const handleVerify2FA = () => {
        if (twoFACode.length !== 6) {
            toast.error('Please enter a valid 6‑digit code.');
            return;
        }
        setShow2FAModal(false);
        const code = twoFACode;
        setTwoFACode('');
        mfaResolveRef.current?.(code);
        mfaResolveRef.current = null;
        mfaRejectRef.current = null;
    };

    const handleGoogle = async () => {
        setGooglePending(true);
        try {
            const provider = new GoogleAuthProvider();

            provider.setCustomParameters({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            });

            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (!user.email) {
                throw new Error('No email found in Google account.');
            }
            const fullname = user.displayName?.trim() || 'Google User';
            const email = user.email || '';

            const savedData = await saveUser(user, fullname, email);
            if (!savedData) throw new Error('Failed to save user data.');
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Google login failed:', error);

                const firebaseError = error as {
                    code?: string;
                    message?: string;
                };

                if (firebaseError.code === 'auth/popup-closed-by-user') {
                    toast.error('Login cancelled by user.');
                } else if (firebaseError.code === 'auth/invalid-credential') {
                    toast.error(
                        'Invalid credentials. Check your Google OAuth setup.',
                    );
                } else if (
                    firebaseError.code === 'auth/multi-factor-auth-required'
                ) {
                    try {
                        const mfaError = error as MultiFactorError;
                        setMfaSubmitting(true);
                        const userCred = await completeMfaWithTotp(
                            mfaError,
                            getTotpCodeViaModal,
                        );
                        const user = userCred.user;
                        const fullname =
                            user.displayName?.trim() || 'Google User';
                        const email = user.email || '';
                        const savedData = await saveUser(user, fullname, email);
                        if (!savedData)
                            throw new Error('Failed to save user data.');
                        toast.success('Login successful with MFA!');
                    } catch (mfaErr) {
                        console.error('MFA (TOTP) completion failed:', mfaErr);
                        // Optionally reopen modal to let them try again:
                        setShow2FAModal(true);
                        toast.error(
                            'The TOTP code was not accepted. Please try again.',
                        );
                    } finally {
                        setMfaSubmitting(false);
                    }
                } else if (firebaseError.code === 'auth/popup-blocked') {
                    toast.error('Popup blocked. Please try again later.');
                } else {
                    toast.error('Google login failed. Please try again later.');
                }
            } else {
                console.error('Unknown error during Google login:', error);
                toast.error('Unexpected error occurred. Please try again.');
            }
        } finally {
            setGooglePending(false);
        }
    };

    return (
        <>
            <LoginForm
                loading={loading}
                handleEmailLogin={handleEmailLogin}
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                googlePending={googlePending || mfaSubmitting}
                emailPending={emailPending}
                handleGoogle={handleGoogle}
            />

            <SetupModal
                show2FAModal={show2FAModal}
                setShow2FAModal={(open) => {
                    if (!open && show2FAModal) {
                        mfaRejectRef.current?.(new Error('User cancelled MFA'));
                        mfaResolveRef.current = null;
                        mfaRejectRef.current = null;
                        setTwoFACode('');
                    }
                    setShow2FAModal(open);
                }}
                twoFACode={twoFACode}
                setTwoFACode={setTwoFACode}
                handleVerify2FA={handleVerify2FA}
                qrDataUrl={null}         // hide QR for sign-in
                secretText={null}        // hide secret for sign-in
                loading={mfaSubmitting}
                confirmButtonText='Verify'
                title='Verify Two-Factor Authentication'
                description='Enter the 6-digit code from your authenticator app'
            />

        </>
    );
}
