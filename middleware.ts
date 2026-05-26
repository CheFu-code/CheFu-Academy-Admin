import {
    SESSION_COOKIE_NAME,
    SESSION_META_COOKIE_NAME,
    SessionMeta,
} from '@/lib/session-constants';
import { NextRequest, NextResponse } from 'next/server';

const AGENT_DISCOVERY_LINKS = [
    '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
    '</docs>; rel="service-doc"; type="text/html"',
    '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
    '</.well-known/openapi.json>; rel="service-desc"; type="application/openapi+json"',
    '</.well-known/openid-configuration>; rel="openid-configuration"; type="application/json"',
    '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"; type="application/json"',
    '</.well-known/mcp/server-card.json>; rel="describedby"; type="application/json"; title="MCP Server Card"',
].join(', ');

const HOME_MARKDOWN = `# CheFu Academy

CheFu Academy is an AI learning platform for guided courses, videos, quizzes, flashcards, and progress tracking.

## Key Resources

- [Courses](/courses)
- [Videos](/videos/all-videos)
- [Create a Course](/courses/create-course)
- [Developer Documentation](/docs)
- [API Catalog](/.well-known/api-catalog)
- [Agent Skills Index](/.well-known/agent-skills/index.json)
- [MCP Server Card](/.well-known/mcp/server-card.json)

## Agent Discovery

Agents can use the API catalog, service documentation, WebMCP tools, and published agent skills to discover CheFu Academy learning and developer workflows.
`;

const AUTH_ROUTES = ['/login', '/phone-number'];
const PROTECTED_PREFIXES = [
    '/dashboard',
    '/admin',
    '/courses',
    '/settings',
    '/videos',
    '/support',
    '/feedback',
    '/upgrade',
    '/add-country',
];

const PUBLIC_APP_ROUTES = new Set([
    '/videos/all-videos',
    '/videos/beginner',
    '/videos/advanced',
    '/videos/search',
]);

function base64UrlToBytes(value: string) {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '=',
    );
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

function bytesToBase64Url(bytes: Uint8Array) {
    let binary = '';
    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

function getSigningSecret() {
    return (
        process.env.AUTH_SESSION_SECRET ||
        process.env.SESSION_COOKIE_SECRET ||
        process.env.FIREBASE_SERVICE_ACCOUNT ||
        ''
    );
}

async function verifySessionMeta(cookieValue?: string): Promise<SessionMeta | null> {
    if (!cookieValue) return null;

    const [payload, signature] = cookieValue.split('.');
    const secret = getSigningSecret();

    if (!payload || !signature || !secret) return null;

    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const signed = await crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(payload),
    );
    const expected = bytesToBase64Url(new Uint8Array(signed));

    if (expected !== signature) return null;

    const meta = JSON.parse(
        new TextDecoder().decode(base64UrlToBytes(payload)),
    ) as SessionMeta;

    if (!meta.exp || meta.exp <= Math.floor(Date.now() / 1000)) {
        return null;
    }

    return meta;
}

function isProtectedPath(pathname: string) {
    if (PUBLIC_APP_ROUTES.has(pathname)) {
        return false;
    }

    return PROTECTED_PREFIXES.some(
        prefix => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

function redirectToLogin(request: NextRequest) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
}

function markdownTokenCount(markdown: string) {
    return String(markdown.trim().split(/\s+/).filter(Boolean).length);
}

function acceptsMarkdown(request: NextRequest) {
    const accept = request.headers.get('accept') || '';
    return accept
        .split(',')
        .map(value => value.trim().toLowerCase())
        .some(value => value.startsWith('text/markdown'));
}

function withAgentDiscoveryHeaders(response: NextResponse) {
    response.headers.set('Link', AGENT_DISCOVERY_LINKS);
    return response;
}

function markdownHomeResponse() {
    return new NextResponse(HOME_MARKDOWN, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            Link: AGENT_DISCOVERY_LINKS,
            Vary: 'Accept',
            'x-markdown-tokens': markdownTokenCount(HOME_MARKDOWN),
        },
    });
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    const sessionMeta = await verifySessionMeta(
        request.cookies.get(SESSION_META_COOKIE_NAME)?.value,
    );
    const isSignedIn = hasSessionCookie && Boolean(sessionMeta);

    if (pathname === '/') {
        if (acceptsMarkdown(request)) {
            return markdownHomeResponse();
        }

        const response = withAgentDiscoveryHeaders(NextResponse.next());
        response.headers.set('Vary', 'Accept');
        return response;
    }

    if (AUTH_ROUTES.includes(pathname) && isSignedIn) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!isProtectedPath(pathname)) {
        return NextResponse.next();
    }

    if (!isSignedIn) {
        return redirectToLogin(request);
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        const isAdmin = sessionMeta?.roles.some(
            role => role.toLowerCase() === 'admin',
        );

        if (!isAdmin) {
            return NextResponse.redirect(new URL('/not-admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/phone-number',
        '/dashboard/:path*',
        '/admin/:path*',
        '/courses/:path*',
        '/settings/:path*',
        '/videos/:path*',
        '/support/:path*',
        '/feedback',
        '/upgrade',
        '/add-country/:path*',
    ],
};
