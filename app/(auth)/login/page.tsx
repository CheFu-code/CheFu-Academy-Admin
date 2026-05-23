'use client';
import { useAuthUser } from '@/hooks/useAuthUser';
import { UseAuth } from '@/services/authService';
import LoginForm from './_components/LoginForm';
import { useState } from 'react';
import { signInWithFirebasePasskey, toPasskeyMessage } from '@/lib/passkeys';
import { syncSessionCookie } from '@/lib/clientSession';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const redirectAfterSignIn = () => router.replace('/dashboard');
    const { loading } = useAuthUser();
    const {
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
        handleForgotPassword,
        resetPending,
    } = UseAuth(redirectAfterSignIn);
    const [passkeyPending, setPasskeyPending] = useState(false);
    const [openPasskeyDialog, setOpenPasskeyDialog] = useState(false);
    const [passkeyIdentifier, setPasskeyIdentifier] = useState('');
    const [mfaMethod, setMfaMethod] = useState<'totp' | 'backup'>('totp');

    const isNoPasskeysEnrolledError = (error: unknown) => {
        const message = (error as Error)?.message || '';
        return /no-passkeys-enrolled/i.test(message);
    };

    async function runPasskeySignIn(identifier: string) {
        const value = identifier.trim();
        if (!value) return;
        setPasskeyPending(true);
        try {
            await signInWithFirebasePasskey(value);
            await syncSessionCookie();
            toast.success('Signed in with passkey');
            redirectAfterSignIn();
        } catch (e: unknown) {
            if (isNoPasskeysEnrolledError(e)) {
                toast.error(
                    'No passkey enrolled for this account.', {
                    description: 'Sign in first, then enroll in Settings > Security.'
                }
                );
                return;
            }
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
                handleForgotPassword={handleForgotPassword}
                resetPending={resetPending}
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

            <Dialog
                open={show2FAModal}
                onOpenChange={(open) => {
                    setShow2FAModal(open);
                    if (!open) {
                        mfaRejectRef.current?.(new Error('MFA verification cancelled.'));
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Two-factor verification</DialogTitle>
                        <DialogDescription>
                            Enter your authenticator code, or use one saved backup code.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex rounded-md border p-1">
                        <Button
                            type="button"
                            variant={mfaMethod === 'totp' ? 'default' : 'ghost'}
                            className="flex-1"
                            onClick={() => {
                                setMfaMethod('totp');
                                setTwoFACode('');
                            }}
                        >
                            Authenticator
                        </Button>
                        <Button
                            type="button"
                            variant={mfaMethod === 'backup' ? 'default' : 'ghost'}
                            className="flex-1"
                            onClick={() => {
                                setMfaMethod('backup');
                                setTwoFACode('');
                            }}
                        >
                            Backup Code
                        </Button>
                    </div>
                    <Input
                        placeholder={mfaMethod === 'totp' ? '123456' : 'ABCD-EFGH'}
                        value={twoFACode}
                        maxLength={mfaMethod === 'totp' ? 6 : 12}
                        onChange={(event) => {
                            const value =
                                mfaMethod === 'totp'
                                    ? event.target.value.replace(/\D/g, '')
                                    : event.target.value.toUpperCase();
                            setTwoFACode(value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && twoFACode.trim()) {
                                event.preventDefault();
                                mfaResolveRef.current?.({
                                    code: twoFACode,
                                    method: mfaMethod,
                                });
                                setShow2FAModal(false);
                            }
                        }}
                    />
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                mfaRejectRef.current?.(
                                    new Error('MFA verification cancelled.'),
                                );
                                setShow2FAModal(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={!twoFACode.trim() || mfaSubmitting}
                            onClick={() => {
                                mfaResolveRef.current?.({
                                    code: twoFACode,
                                    method: mfaMethod,
                                });
                                setShow2FAModal(false);
                            }}
                        >
                            {mfaSubmitting ? 'Verifying...' : 'Verify'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
