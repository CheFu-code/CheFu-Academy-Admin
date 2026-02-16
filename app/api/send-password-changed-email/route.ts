import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const resolvePasswordChangedEmailUrl = () => {
    const explicitUrl =
        process.env.PASSWORD_CHANGED_API_URL ||
        process.env.NEXT_PUBLIC_PASSWORD_CHANGED_API_URL;
    if (explicitUrl) {
        return trimTrailingSlash(explicitUrl);
    }

    const projectId =
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
        process.env.FIREBASE_PROJECT_ID ||
        process.env.GCLOUD_PROJECT;
    if (!projectId) {
        return '';
    }

    return `https://us-central1-${projectId}.cloudfunctions.net/sendPasswordChangedEmail`;
};

export async function POST(req: Request) {
    const endpoint = resolvePasswordChangedEmailUrl();
    if (!endpoint) {
        return NextResponse.json(
            { error: 'Password changed email endpoint is not configured.' },
            { status: 500 },
        );
    }

    try {
        const authorization = req.headers.get('authorization');
        const contentType = req.headers.get('content-type') || 'application/json';
        const body = await req.text();

        const upstream = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': contentType,
                ...(authorization ? { Authorization: authorization } : {}),
            },
            body: body || '{}',
        });

        const responseContentType = upstream.headers.get('content-type') || '';
        if (responseContentType.includes('application/json')) {
            const json = await upstream.json().catch(() => ({}));
            return NextResponse.json(json, { status: upstream.status });
        }

        const text = await upstream.text().catch(() => '');
        return new Response(text, {
            status: upstream.status,
            headers: {
                'Content-Type': responseContentType || 'text/plain; charset=utf-8',
            },
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : 'Failed to call password changed email endpoint.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
