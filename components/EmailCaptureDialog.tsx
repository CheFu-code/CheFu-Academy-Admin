'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type EmailCaptureDialogProps = {
    open: boolean;
    defaultName?: string;
    onConfirm: (email: string) => void;
    onCancel: () => void;
};

export function EmailCaptureDialog({
    open,
    defaultName,
    onConfirm,
    onCancel,
}: EmailCaptureDialogProps) {
    const [email, setEmail] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (open) {
            setEmail('');
            setError(null);
            setSubmitting(false);
            // Autofocus
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    const handleConfirm = async () => {
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setSubmitting(true);
        onConfirm(email.trim());
    };

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next) onCancel(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>We need your email</DialogTitle>
                    <DialogDescription>
                        We couldn’t get your email from Facebook{defaultName ? ` for ${defaultName}` : ''}.
                        Please enter your email to continue.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2 py-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        ref={inputRef}
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(null); }}
                        disabled={submitting}
                    />
                    {error && <p className={cn('text-sm text-red-600')}>{error}</p>}
                </div>

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleConfirm} disabled={submitting}>
                        Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
