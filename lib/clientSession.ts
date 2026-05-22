'use client';

import { auth } from '@/lib/firebase';

export async function syncSessionCookie() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        await clearSessionCookie();
        return;
    }

    const idToken = await currentUser.getIdToken(true);
    const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to sync auth session.');
    }
}

export async function clearSessionCookie() {
    await fetch('/api/auth/session', {
        method: 'DELETE',
    });
}
