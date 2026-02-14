import { BACKEND_URL, DEFAULT_PREFERENCES } from '@/constants/Data';
import { getFriendlyAuthMessage } from '@/helpers/authErrors';
import { completeMfaWithTotp } from '@/helpers/authMfaTotp';
import { fetchEmailFromFacebookGraph } from '@/helpers/getUserEmail';
import { useEmailCapture } from '@/hooks/useEmailCapture';
import { auth, db } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    MultiFactorError,
    signInWithEmailAndPassword,
    signInWithPopup,
    User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import os from 'os';
import { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

export const saveUser = async (user: User, fullname: string, email: string) => {
    try {
        const deviceInfo = {
            platform: os.platform(), // 'darwin', 'win32', 'linux'
            osType: os.type(), // 'Linux', 'Darwin', 'Windows_NT'
            osRelease: os.release(), // OS version
            arch: os.arch(), // 'x64', 'arm', etc.
        };

        const userEmail = (user.email ?? email)?.trim();
        const userFullName = user.displayName || fullname || '';
        const userPhoto = user?.photoURL ?? null;
        const userProvider =
            user?.providerData?.[0]?.providerId ?? user?.providerId ?? 'email';

        const userDocRef = doc(db, 'users', userEmail);
        const userDoc = await getDoc(userDocRef);
        const now = new Date();

        if (userDoc.exists()) {
            const existingData = userDoc.data();
            const updatedData = {
                ...existingData,
                lastLogin: now,
                updatedAt: now,
            };
            await setDoc(userDocRef, updatedData, { merge: true });
            toast.success('Welcome back!');
            return updatedData;
        } else {
            const data = {
                fullname: userFullName,
                email: userEmail,
                member: false,
                isVerified: user.emailVerified,
                createdAt: now,
                updatedAt: now,
                uid: user.uid,
                emailPreferences: DEFAULT_PREFERENCES,
                profilePicture: userPhoto,
                lastLogin: now,
                provider: userProvider,
                onboardingComplete: false,
                roles: ['Student'],
                bio: '',
                language: 'en',
                subscriptionStatus: 'free',
                deviceInfo,
                country: '',
            };

            const cleanData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== undefined),
            );

            await setDoc(userDocRef, cleanData);
            await sendWelcomeEmail(userEmail, userFullName);
            toast.success('Welcome! Your account has been created.');
            return cleanData;
        }
    } catch (e) {
        throw new Error(
            `Failed to save your data. Please try again later. ${e}`,
        );
    }
};

const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        await fetch(`${BACKEND_URL}/api/email/send-welcome`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name }),
        });
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }
};

export const UseAuth = () => {
    const { getEmailViaDialog, DialogPortal } = useEmailCapture();
    const [googlePending, setGooglePending] = useState(false);
    const [mfaSubmitting, setMfaSubmitting] = useState(false);
    const [twoFACode, setTwoFACode] = useState('');
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailPending, startEmailTransition] = useTransition();
    const [facebookPending, setFacebookPending] = useState(false);

    const mfaResolveRef = useRef<((code: string) => void) | null>(null);
    const mfaRejectRef = useRef<((err?: unknown) => void) | null>(null);

    const getTotpCodeViaModal = () =>
        new Promise<string>((resolve, reject) => {
            setTwoFACode('');
            setShow2FAModal(true);
            mfaResolveRef.current = resolve;
            mfaRejectRef.current = reject;
        });

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
                    } catch (mfaError) {
                        // Re-trigger the full MFA flow with a new promise
                        try {
                            const retryCred = await completeMfaWithTotp(
                                mfaError as MultiFactorError,
                                getTotpCodeViaModal,
                            );
                            const retryUser = retryCred.user;
                            const fullname =
                                retryUser.displayName?.trim() || 'Google User';
                            const email = retryUser.email || '';
                            const savedData = await saveUser(
                                retryUser,
                                fullname,
                                email,
                            );
                            if (!savedData)
                                throw new Error('Failed to save user data.');
                            toast.success('Login successful with MFA!');
                        } catch (retryErr) {
                            console.error('MFA retry also failed:', retryErr);
                            toast.error(
                                'MFA verification failed. Please try logging in again.',
                            );
                        }
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

    const handleEmailLogin = async () => {
        startEmailTransition(async () => {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success('Login successful!');
            } catch (error) {
                const message = getFriendlyAuthMessage(error);
                toast.error(message);
            }
        });
    };

    const signInWithFacebook = async () => {
        try {
            setFacebookPending(true);
            const provider = new FacebookAuthProvider();
            provider.addScope('email');
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            let email = user.email ?? '';

            if (!email) {
                const emailFromGraph =
                    await fetchEmailFromFacebookGraph(result);
                if (emailFromGraph) {
                    email = emailFromGraph;
                }
            }

            // If still missing -> shadcn dialog

            if (!email) {
                const fullname = user.displayName?.trim() || 'Facebook User';
                try {
                    email = await getEmailViaDialog(fullname); // ⬅️ This triggers the modal
                    if (!email) {
                        toast.error('Email is required to continue.');
                        return;
                    }
                } catch {
                    toast.error('Email is required to continue.');
                    return;
                }
            }

            const fullname = user.displayName?.trim() || 'Facebook User';

            // 5) Persist to your backend
            const savedData = await saveUser(user, fullname, email);
            if (!savedData) throw new Error('Failed to save user data.');

            console.log('Facebook user:', user);
        } catch (error) {
            console.error('Facebook login failed:', error);
            if ((error as FirebaseError)?.code === 'auth/popup-closed-by-user')
                toast.error('Login cancelled.');
            else if ((error as FirebaseError)?.code === 'auth/popup-blocked')
                toast.error('Popup blocked, allow popups and try again.');
            else toast.error('Facebook login failed. Please try again.');
        } finally {
            setFacebookPending(false);
        }
    };

    return {
        handleGoogle,
        googlePending,
        mfaSubmitting,
        show2FAModal,
        setShow2FAModal,
        mfaResolveRef,
        mfaRejectRef,
        twoFACode,
        setTwoFACode,
        handleEmailLogin,
        email,
        setEmail,
        password,
        setPassword,
        emailPending,
        signInWithFacebook,
        facebookPending,
        DialogPortal,
    };
};
