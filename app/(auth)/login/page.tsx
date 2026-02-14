'use client';
import { useAuthUser } from '@/hooks/useAuthUser';
import { UseAuth } from '@/services/authService';
import LoginForm from './_components/LoginForm';
import { useState } from 'react';
import { signInWithFirebasePasskey, toPasskeyMessage } from '@/lib/passkeys';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    const [openPasskeyDialog, setOpenPasskeyDialog] = useState(false);
    const [passkeyIdentifier, setPasskeyIdentifier] = useState('');

    async function runPasskeySignIn(identifier: string) {
        const value = identifier.trim();
        if (!value) return;
        setPasskeyPending(true);
        try {
            await signInWithFirebasePasskey(value);
            console.log('Signed in with passkey');
            toast.success('Signed in with passkey');
        } catch (e: unknown) {
            const message = toPasskeyMessage(e);
            toast.error(message);
            console.error('passkey error', e);
        } finally {
            setPasskeyPending(false);
        }
    }

    async function handlePasskey() {
        const currentEmail = email.trim();
        if (currentEmail) {
            await runPasskeySignIn(currentEmail);
            return;
        }
        setPasskeyIdentifier('');
        setOpenPasskeyDialog(true);
    }

    async function confirmPasskeyIdentifier() {
        const identifier = passkeyIdentifier.trim();
        if (!identifier) return;
        setEmail(identifier);
        setOpenPasskeyDialog(false);
        await runPasskeySignIn(identifier);
    }

    return (
        <>
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

            <Dialog open={openPasskeyDialog} onOpenChange={setOpenPasskeyDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Continue with passkey</DialogTitle>
                        <DialogDescription>
                            Enter your email to continue with passkey sign-in.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        type="email"
                        placeholder="email@example.com"
                        value={passkeyIdentifier}
                        onChange={(e) => setPasskeyIdentifier(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') void confirmPasskeyIdentifier();
                        }}
                    />
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenPasskeyDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => void confirmPasskeyIdentifier()}
                            disabled={!passkeyIdentifier.trim() || passkeyPending}
                        >
                            Continue
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
