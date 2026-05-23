'use client';

type DesktopNotificationPayload = {
    title?: string;
    body?: string;
    silent?: boolean;
};

export async function notifyDesktop({
    title = 'CheFu Academy',
    body = '',
    silent = false,
}: DesktopNotificationPayload) {
    if (typeof window === 'undefined') return false;

    if (window.chefuDesktop?.isElectron) {
        try {
            return await window.chefuDesktop.notify({ title, body, silent });
        } catch (error) {
            console.error('Failed to show Electron notification:', error);
            return false;
        }
    }

    if (!('Notification' in window)) return false;

    try {
        if (Notification.permission === 'default') {
            await Notification.requestPermission();
        }

        if (Notification.permission !== 'granted') return false;

        new Notification(title, { body, silent });
        return true;
    } catch (error) {
        console.error('Failed to show browser notification:', error);
        return false;
    }
}

export async function setDesktopProgress(
    value?: number,
    mode: 'none' | 'normal' | 'indeterminate' | 'error' | 'paused' = 'normal',
) {
    if (typeof window === 'undefined') return false;
    if (!window.chefuDesktop?.isElectron) return false;

    try {
        return await window.chefuDesktop.setProgress({ value, mode });
    } catch (error) {
        console.error('Failed to set desktop progress:', error);
        return false;
    }
}
