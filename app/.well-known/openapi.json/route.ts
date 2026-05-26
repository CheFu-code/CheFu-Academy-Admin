import { BACKEND_URL, WEBSITE_URL } from '@/constants/Data';

export const dynamic = 'force-static';

export function GET() {
    return Response.json(
        {
            openapi: '3.1.0',
            info: {
                title: 'CheFu Academy API',
                version: '1.0.0',
                description:
                    'Protected API surface for CheFu Academy courses, videos, billing, AI generation, and account sessions.',
            },
            servers: [
                {
                    url: BACKEND_URL,
                    description: 'CheFu Academy production API',
                },
            ],
            externalDocs: {
                url: `${WEBSITE_URL}/docs`,
                description: 'CheFu Academy developer documentation',
            },
            paths: {
                '/health': {
                    get: {
                        summary: 'API health check',
                        responses: {
                            '200': {
                                description: 'API is healthy',
                            },
                        },
                    },
                },
                '/auth/session': {
                    post: {
                        summary:
                            'Exchange a Firebase ID token for a CheFu session cookie',
                        security: [{ bearerAuth: [] }],
                        responses: {
                            '200': {
                                description: 'Session created',
                            },
                            '401': {
                                description: 'Authentication failed',
                            },
                        },
                    },
                },
                '/courses/{courseId}/learning': {
                    get: {
                        summary: 'Open a course chapter for an authenticated learner',
                        security: [{ bearerAuth: [] }],
                        parameters: [
                            {
                                name: 'courseId',
                                in: 'path',
                                required: true,
                                schema: { type: 'string' },
                            },
                            {
                                name: 'chapter',
                                in: 'query',
                                required: true,
                                schema: { type: 'integer', minimum: 0 },
                            },
                        ],
                        responses: {
                            '200': { description: 'Course learning data' },
                            '401': { description: 'Authentication required' },
                            '403': { description: 'Chapter access denied' },
                        },
                    },
                },
                '/ai/generate': {
                    post: {
                        summary: 'Generate AI course, topic, or tutor content',
                        security: [{ bearerAuth: [] }],
                        responses: {
                            '200': { description: 'Generated AI response' },
                            '401': { description: 'Authentication required' },
                        },
                    },
                },
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'Firebase ID token or CheFu session',
                    },
                },
            },
        },
        {
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=86400',
                'Content-Type': 'application/openapi+json; charset=utf-8',
            },
        },
    );
}
