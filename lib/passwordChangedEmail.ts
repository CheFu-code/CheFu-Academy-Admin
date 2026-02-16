import { auth } from './firebase';

const API = (
    process.env.NEXT_PUBLIC_PASSWORD_CHANGED_API_URL ||
    '/api/send-password-changed-email'
).replace(/\/+$/, '');

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
        credentials: 'omit',
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
