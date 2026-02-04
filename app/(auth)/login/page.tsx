'use client';
import { getFriendlyAuthMessage } from '@/helpers/authErrors';
import { useAuthUser } from '@/hooks/useAuthUser';
import { auth } from '@/lib/firebase';
import { saveUser } from '@/services/authService';
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import LoginForm from './_components/LoginForm';

export default function LoginPage() {
    const { loading } = useAuthUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailPending, startEmailTransition] = useTransition();
    const [googlePending, startGoogleTransition] = useTransition();

    const handleGoogle = async () => {
        startGoogleTransition(async () => {
            try {
                const provider = new GoogleAuthProvider();

                provider.setCustomParameters({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                });

                // Sign in with Google
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
                    } else if (
                        firebaseError.code === 'auth/invalid-credential'
                    ) {
                        toast.error(
                            'Invalid credentials. Check your Google OAuth setup.',
                        );
                    } else {
                        toast.error(
                            'Google login failed. Please try again later.',
                        );
                    }
                } else {
                    console.error('Unknown error during Google login:', error);
                    toast.error('Unexpected error occurred. Please try again.');
                }
            }
        });
    };

    const handleEmailLogin = async () => {
        startEmailTransition(async () => {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success('Login successful!');
            } catch (error) {
                const message = getFriendlyAuthMessage(error);
                toast.error(message);
                console.error('Email login failed:', error);
            }
        });
    };

    return (
        <LoginForm
            loading={loading}
            handleEmailLogin={handleEmailLogin}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            googlePending={googlePending}
            emailPending={emailPending}
            handleGoogle={handleGoogle}
        />
    );
}
