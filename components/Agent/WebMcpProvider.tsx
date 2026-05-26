'use client';

import { useEffect } from 'react';

type JsonSchema = Record<string, unknown>;

type WebMcpTool = {
    name: string;
    title: string;
    description: string;
    inputSchema: JsonSchema;
    annotations?: {
        readOnlyHint?: boolean;
        untrustedContentHint?: boolean;
    };
    execute: (input?: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

type ModelContext = {
    registerTool?: (
        tool: WebMcpTool,
        options?: { signal?: AbortSignal },
    ) => void;
    provideContext?: (
        context: { tools: WebMcpTool[] },
        options?: { signal?: AbortSignal },
    ) => void | Promise<void>;
};

declare global {
    interface Navigator {
        modelContext?: ModelContext;
    }
}

const stringProperty = (description: string) => ({
    type: 'string',
    description,
});

const openPath = (path: string) => {
    const url = new URL(path, window.location.origin);
    window.location.assign(url.toString());
    return url.toString();
};

const tools: WebMcpTool[] = [
    {
        name: 'chefu.search-courses',
        title: 'Search Courses',
        description:
            'Open CheFu Academy course search for a learning topic or keyword.',
        inputSchema: {
            type: 'object',
            properties: {
                query: stringProperty('Course topic or keyword to search for.'),
            },
            required: ['query'],
            additionalProperties: false,
        },
        execute: async (input) => {
            const query = String(input?.query || '').trim();
            const url = openPath(
                `/courses/search?query=${encodeURIComponent(query)}`,
            );
            return { ok: true, url };
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
                query: stringProperty('Video topic, skill, or category.'),
            },
            required: ['query'],
            additionalProperties: false,
        },
        execute: async (input) => {
            const query = String(input?.query || '').trim();
            const url = openPath(
                `/videos/search?query=${encodeURIComponent(query)}`,
            );
            return { ok: true, url };
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
        execute: async () => {
            const url = openPath('/courses/create-course');
            return { ok: true, url };
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
        execute: async () => {
            const url = openPath('/docs');
            return { ok: true, url };
        },
    },
];

export default function WebMcpProvider() {
    useEffect(() => {
        const modelContext = navigator.modelContext;
        if (!modelContext) return;

        const controller = new AbortController();

        try {
            if (typeof modelContext.provideContext === 'function') {
                void modelContext.provideContext(
                    { tools },
                    { signal: controller.signal },
                );
            }

            if (typeof modelContext.registerTool === 'function') {
                tools.forEach((tool) => {
                    try {
                        modelContext.registerTool?.(tool, {
                            signal: controller.signal,
                        });
                    } catch (error) {
                        console.debug('WebMCP tool registration skipped:', error);
                    }
                });
            }
        } catch (error) {
            console.debug('WebMCP context unavailable:', error);
        }

        return () => controller.abort();
    }, []);

    return null;
}
