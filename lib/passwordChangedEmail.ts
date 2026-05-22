import { auth } from './firebase';
import { getApiUrl } from './api-url';

const API = getApiUrl(
    '/email/password-changed',
    '/api/send-password-changed-email',
);

export async function sendPasswordChangedAlert() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error('No user is signed in.');
    }

    const idToken = await currentUser.getIdToken();
    const response = await fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({}),
        credentials: 'include',
    });

    if (!response.ok) {
        let message = `Request failed with status ${response.status}`;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const json = await response.json().catch(() => undefined) as
                | { error?: string; message?: string }
                | undefined;
            message = json?.error || json?.message || message;
        } else {
            const text = await response.text().catch(() => '');
            message = text || message;
        }
        throw new Error(message);
    }

    return response.json() as Promise<{ sent: boolean; reason?: string }>;
}
