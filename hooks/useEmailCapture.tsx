'use client';

import { EmailCaptureDialog } from '@/components/EmailCaptureDialog';
import * as React from 'react';

export function useEmailCapture() {
    const [open, setOpen] = React.useState(false);
    const [defaultName, setDefaultName] = React.useState<string | undefined>(undefined);
    const pendingResolve = React.useRef<((email: string) => void) | null>(null);
    const pendingReject = React.useRef<((reason?: unknown) => void) | null>(null);

    const getEmailViaDialog = React.useCallback((name?: string) => {
        setDefaultName(name);
        setOpen(true);
        return new Promise<string>((resolve, reject) => {
            pendingResolve.current = resolve;
            pendingReject.current = reject;
        });
    }, []);

    const handleConfirm = (email: string) => {
        setOpen(false);
        pendingResolve.current?.(email);
        pendingResolve.current = null;
        pendingReject.current = null;
    };

    const handleCancel = () => {
        setOpen(false);
        pendingReject.current?.(new Error('User cancelled email capture'));
        pendingResolve.current = null;
        pendingReject.current = null;
    };

    const DialogPortal = React.useMemo(
        () => (
            <EmailCaptureDialog
                open={open}
                defaultName={defaultName}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        ),
        [open, defaultName]
    );

    return { getEmailViaDialog, DialogPortal };
}