import { WEBSITE_URL } from '@/constants/Data';

export const dynamic = 'force-static';

const tools = [
    {
        name: 'chefu.search-courses',
        title: 'Search Courses',
        description:
            'Open CheFu Academy course search for a learning topic or keyword.',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Course topic or keyword to search for.',
                },
            },
            required: ['query'],
            additionalProperties: false,
        },
    },
    {
        name: 'chefu.search-videos',
        title: 'Search Videos',
        description:
            'Open CheFu Academy video search for a category, skill, or topic.',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Video topic, skill, or category.',
                },
            },
            required: ['query'],
            additionalProperties: false,
        },
    },
    {
        name: 'chefu.open-create-course',
        title: 'Create Course',
        description:
            'Open the AI course creation workflow so the user can generate a new course.',
        inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
        },
    },
    {
        name: 'chefu.open-api-docs',
        title: 'Open API Docs',
        description:
            'Open CheFu Academy developer documentation and SDK integration guides.',
        inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
        },
        annotations: {
            readOnlyHint: true,
        },
    },
];

export function GET() {
    return Response.json(
        {
            $schema:
                'https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json',
            name: 'com.chefu.chefuacademy',
            title: 'CheFu Academy',
            description:
                'MCP discovery card for CheFu Academy learning, video, course generation, and documentation workflows.',
            version: '0.1.1',
            serverInfo: {
                name: 'CheFu Academy',
                version: '0.1.1',
            },
            websiteUrl: WEBSITE_URL,
            transport: {
                type: 'webmcp',
                endpoint: WEBSITE_URL,
                description:
                    'Browser WebMCP tools are exposed on page load through navigator.modelContext.provideContext().',
            },
            transports: [
                {
                    type: 'webmcp',
                    endpoint: WEBSITE_URL,
                    description:
                        'Browser WebMCP tools are exposed on page load through navigator.modelContext.provideContext().',
                },
            ],
            supportedProtocolVersions: ['2025-03-26', '2025-06-18'],
            capabilities: {
                tools: {
                    listChanged: false,
                },
                resources: {
                    subscribe: false,
                    listChanged: false,
                },
                prompts: {
                    listChanged: false,
                },
            },
            tools,
            resources: [
                {
                    name: 'CheFu Academy API Catalog',
                    uri: `${WEBSITE_URL}/.well-known/api-catalog`,
                    description:
                        'Linkset catalog for CheFu Academy API, docs, status, and authentication metadata.',
                    mimeType: 'application/linkset+json',
                },
                {
                    name: 'CheFu Academy Agent Skills',
                    uri: `${WEBSITE_URL}/.well-known/agent-skills/index.json`,
                    description:
                        'Agent skills index for CheFu Academy learning workflows.',
                    mimeType: 'application/json',
                },
            ],
            documentation: `${WEBSITE_URL}/docs`,
        },
        {
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            },
        },
    );
}
