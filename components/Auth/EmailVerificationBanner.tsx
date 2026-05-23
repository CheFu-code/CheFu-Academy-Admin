'use client';

import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { logSecurityEvent } from '@/lib/securityEvents';
import { sendEmailVerification } from 'firebase/auth';
import { MailCheck } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function EmailVerificationBanner() {
    const [needsVerification, setNeedsVerification] = useState(false);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setNeedsVerification(Boolean(user?.email && !user.emailVerified));
        });

        return () => unsubscribe();
    }, []);

    const resendVerification = () => {
        startTransition(async () => {
            const user = auth.currentUser;
            if (!user) {
                toast.error('Please sign in again.');
                return;
            }

            try {
                await sendEmailVerification(user, {
                    url:
                        process.env.NEXT_PUBLIC_EMAIL_VERIFY_CONTINUE_URL ||
                        `${window.location.origin}/dashboard`,
                    handleCodeInApp: false,
                });
                await logSecurityEvent('verification_email_sent');
                toast.success('Verification email sent.');
            } catch (error) {
                console.error('Failed to send verification email:', error);
                toast.error('Could not send verification email.');
            }
        });
    };

    if (!needsVerification) return null;

    return (
        <section className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-cyan-500 text-white">
                        <MailCheck className="size-5" />
                    </div>
                    <div>
                        <p className="font-semibold">Verify your email</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Confirm your email to keep your account secure and recoverable.
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={resendVerification}
                    disabled={pending}
                >
                    {pending ? 'Sending...' : 'Resend email'}
                </Button>
            </div>
        </section>
    );
}
