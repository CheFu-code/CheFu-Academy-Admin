import { BACKEND_URL, SDK_URL, WEBSITE_URL } from '@/constants/Data';

export const dynamic = 'force-static';

export function GET() {
    return Response.json(
        {
            publisher: 'CheFu Academy',
            description:
                'API and developer resources for CheFu Academy courses, videos, authentication, and SDK integrations.',
            links: [
                {
                    rel: 'service-doc',
                    href: `${WEBSITE_URL}/docs`,
                    type: 'text/html',
                    title: 'CheFu Academy API documentation',
                },
                {
                    rel: 'service-desc',
                    href: SDK_URL,
                    type: 'text/html',
                    title: 'CheFu Academy SDK service',
                },
                {
                    rel: 'describedby',
                    href: `${WEBSITE_URL}/.well-known/agent-skills/index.json`,
                    type: 'application/json',
                    title: 'Agent skills discovery index',
                },
            ],
            apis: [
                {
                    name: 'CheFu Academy Backend API',
                    baseUrl: BACKEND_URL,
                    documentation: `${WEBSITE_URL}/docs`,
                },
                {
                    name: 'CheFu Academy JavaScript SDK',
                    baseUrl: SDK_URL,
                    documentation: `${WEBSITE_URL}/docs/installation`,
                },
            ],
        },
        {
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            },
        },
    );
}
