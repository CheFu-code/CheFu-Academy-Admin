import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const region = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION || 'us-central1';
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!projectId) {
        return NextResponse.json(
            { error: 'Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID for passkey proxy.' },
            { status: 500 },
        );
    }

    const base = `https://${region}-${projectId}.cloudfunctions.net`;
    const endpoints = [`${base}/webauthnApi`, `${base}/ext-firebase-web-authn-api`];

    try {
        const body = await request.text();
        const contentType = request.headers.get('content-type') || 'application/json';
        let lastResponse: Response | null = null;

        for (const endpoint of endpoints) {
            const upstream = await fetch(endpoint, {
                method: 'POST',
                headers: { 'content-type': contentType },
                body,
                cache: 'no-store',
            });
            if (upstream.status !== 404) {
                const responseBody = await upstream.text();
                return new NextResponse(responseBody, {
                    status: upstream.status,
                    headers: {
                        'content-type':
                            upstream.headers.get('content-type') ||
                            'application/json',
                    },
                });
            }
            lastResponse = upstream;
        }

        const fallbackBody = lastResponse ? await lastResponse.text() : '';
        return new NextResponse(fallbackBody || 'Passkey endpoint not found.', {
            status: lastResponse?.status || 404,
            headers: {
                'content-type':
                    lastResponse?.headers.get('content-type') || 'text/plain',
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to reach passkey backend.';
        return NextResponse.json({ error: message }, { status: 502 });
    }
}
