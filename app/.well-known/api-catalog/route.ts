import { BACKEND_URL, SDK_URL, WEBSITE_URL } from '@/constants/Data';

export const dynamic = 'force-static';

export function GET() {
    return new Response(
        JSON.stringify({
            linkset: [
                {
                    anchor: BACKEND_URL,
                    'service-desc': [
                        {
                            href: `${WEBSITE_URL}/.well-known/openapi.json`,
                            type: 'application/openapi+json',
                            title: 'CheFu Academy OpenAPI description',
                        },
                    ],
                    'service-doc': [
                        {
                            href: `${WEBSITE_URL}/docs`,
                            type: 'text/html',
                            title: 'CheFu Academy API documentation',
                        },
                    ],
                    status: [
                        {
                            href: `${BACKEND_URL}/health`,
                            type: 'application/json',
                            title: 'CheFu Academy API health',
                        },
                    ],
                    describedby: [
                        {
                            href: `${WEBSITE_URL}/.well-known/oauth-protected-resource`,
                            type: 'application/json',
                            title: 'OAuth protected resource metadata',
                        },
                    ],
                },
                {
                    anchor: SDK_URL,
                    'service-desc': [
                        {
                            href: `${WEBSITE_URL}/.well-known/openapi.json`,
                            type: 'application/openapi+json',
                            title: 'CheFu Academy SDK API description',
                        },
                    ],
                    'service-doc': [
                        {
                            href: `${WEBSITE_URL}/docs/installation`,
                            type: 'text/html',
                            title: 'CheFu Academy SDK installation guide',
                        },
                    ],
                    status: [
                        {
                            href: `${BACKEND_URL}/health`,
                            type: 'application/json',
                            title: 'CheFu Academy API health',
                        },
                    ],
                },
            ],
        }),
        {
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=86400',
                'Content-Type': 'application/linkset+json; charset=utf-8',
            },
        },
    );
}
