'use client';

import { auth } from '@/lib/firebase';
import { getApiUrl } from '@/lib/api-url';

export async function syncSessionCookie() {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        await clearSessionCookie();
        return;
    }

    const idToken = await currentUser.getIdToken(true);
    const response = await fetch(getApiUrl('/auth/session'), {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({})) as {
            error?: string;
            requestId?: string;
        };
        const requestId = data.requestId ? ` Request ID: ${data.requestId}` : '';
        throw new Error(
            `${data.error || 'Failed to sync auth session.'}${requestId}`,
        );
    }
}

export async function clearSessionCookie() {
    await fetch(getApiUrl('/auth/session'), {
        method: 'DELETE',
        credentials: 'include',
    });
}
