'use client';

import { notifyDesktop } from '@/lib/desktop-notify';
import { useEffect } from 'react';
import { toast } from 'sonner';

const patchedKey = '__chefuDesktopToastPatched';

function getToastBody(message: unknown) {
    if (typeof message === 'string') return message;
    if (typeof message === 'number') return String(message);
    return '';
}

export default function DesktopToastBridge() {
    useEffect(() => {
        if (!window.chefuDesktop?.isElectron) return;
        if ((window as unknown as Record<string, boolean>)[patchedKey]) return;

        const toastMethods = toast as unknown as Record<
            string,
            (...args: unknown[]) => unknown
        >;
        const labels: Record<string, string> = {
            success: 'Success',
            error: 'Action needed',
            warning: 'Warning',
            info: 'CheFu Academy',
            message: 'CheFu Academy',
        };

        Object.keys(labels).forEach(method => {
            const original = toastMethods[method];
            if (typeof original !== 'function') return;

            toastMethods[method] = (...args: unknown[]) => {
                const result = original(...args);
                const body = getToastBody(args[0]);

                if (body) {
                    void notifyDesktop({
                        title: labels[method],
                        body,
                    });
                }

                return result;
            };
        });

        (window as unknown as Record<string, boolean>)[patchedKey] = true;
    }, []);

    return null;
}
