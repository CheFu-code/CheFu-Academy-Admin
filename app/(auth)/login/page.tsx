'use client';
import { useAuthUser } from '@/hooks/useAuthUser';
import { UseAuth } from '@/services/authService';
import LoginForm from './_components/LoginForm';
import { useState } from 'react';
import { signInWithFirebasePasskey } from '@/lib/passkeys';
import { toast } from 'sonner';

export default function LoginPage() {
    const { loading } = useAuthUser();
    const {
        handleGoogle,
        googlePending,
        handleEmailLogin,
        email,
        setEmail,
        password,
        setPassword,
        emailPending,
    } = UseAuth();
    const [passkeyPending, setPasskeyPending] = useState(false);

    async function handlePasskey() {
        try {
            const identifier = email.trim();
            if (!identifier) {
                toast.error('Enter your email before using passkey sign-in.');
                return;
            }
            setPasskeyPending(true);
            await signInWithFirebasePasskey(identifier);
            console.log('Signed in with passkey');
            toast.success('Signed in with passkey');
        } catch (e: unknown) {
            const message =
                e instanceof Error ? e.message : 'Passkey sign-in failed.';
            toast.error(message);
            console.error('passkey error', e);
        } finally {
            setPasskeyPending(false);
        }
    }

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
            handlePasskey={handlePasskey}
            passkeyPending={passkeyPending}
        />
    );
}
