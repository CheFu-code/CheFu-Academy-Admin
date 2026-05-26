import { BACKEND_URL, WEBSITE_URL } from '@/constants/Data';

export const dynamic = 'force-static';

export function GET() {
    return Response.json(
        {
            resource: BACKEND_URL,
            authorization_servers: [WEBSITE_URL],
            scopes_supported: [
                'openid',
                'email',
                'profile',
                'courses:read',
                'courses:write',
                'videos:read',
                'billing:read',
                'ai:generate',
            ],
            bearer_methods_supported: ['header'],
            resource_documentation: `${WEBSITE_URL}/docs/authentication`,
        },
        {
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            },
        },
    );
}
