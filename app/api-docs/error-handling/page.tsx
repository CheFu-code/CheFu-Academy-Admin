'use client';

import Header from '@/components/Shared/Header';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import CodeHighlighter from '../_components/CodeHighlighter';

const ErrorHandling = () => {
    return (
        <div className="min-h-screen bg-background pb-20">
            <Header
                header="Error Handling"
                description="Understand SDK errors, HTTP status codes, and how to handle failures gracefully."
            />

            <Separator className="my-10" />

            {/* Overview */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Errors can occur due to invalid requests, authentication
                    issues, network failures, or server-side problems. The CheFu
                    Academy SDK provides consistent error responses to help you
                    detect and recover from failures reliably.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    All SDK methods throw errors when a request fails. You
                    should always handle errors explicitly.
                </p>
            </section>

            <Separator className="my-10" />

            {/* Try Catch */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Basic error handling</h2>
                <p className="text-muted-foreground">
                    Wrap SDK calls in a{' '}
                    <code className="font-mono">try/catch</code> block to
                    prevent unhandled promise rejections.
                </p>

                <CodeHighlighter
                    code={`try {
  const courses = await sdk.courses.getAll();
} catch (error) {
  console.error(error.message);
}`}
                />
            </section>

            <Separator className="my-10" />

            {/* Error Structure */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Error object structure</h2>
                <p className="text-muted-foreground">
                    SDK errors follow a predictable structure.
                </p>

                <CodeHighlighter
                    code={`{
  message: string;
  statusCode?: number;
  code?: string;
}`}
                />

                <p className="text-muted-foreground">
                    This allows you to handle errors programmatically based on
                    status code or error type.
                </p>
            </section>

            <Separator className="my-10" />

            {/* HTTP Status Codes */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Common HTTP status codes</h2>

                <div className="space-y-2 text-muted-foreground">
                    <p>
                        <strong className="text-foreground">
                            400 Bad Request
                        </strong>{' '}
                        – Invalid parameters or malformed request.
                    </p>
                    <p>
                        <strong className="text-foreground">
                            401 Unauthorized
                        </strong>{' '}
                        – Missing or invalid API key.
                    </p>
                    <p>
                        <strong className="text-foreground">
                            403 Forbidden
                        </strong>{' '}
                        – API key revoked or insufficient permissions.
                    </p>
                    <p>
                        <strong className="text-foreground">
                            404 Not Found
                        </strong>{' '}
                        – Requested resource does not exist.
                    </p>
                    <p>
                        <strong className="text-foreground">
                            429 Too Many Requests
                        </strong>{' '}
                        – Rate limit exceeded.
                    </p>
                    <p>
                        <strong className="text-foreground">
                            500 Internal Server Error
                        </strong>{' '}
                        – Unexpected server error.
                    </p>
                </div>
            </section>

            <Separator className="my-10" />

            {/* Conditional Handling */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Handling errors by type</h2>
                <p className="text-muted-foreground">
                    Use conditional logic to respond differently based on the
                    error status code.
                </p>

                <CodeHighlighter
                    code={`try {
  await sdk.courses.getAll();
} catch (error) {
  if (error.statusCode === 401) {
    // Invalid API key
  } else if (error.statusCode === 429) {
    // Rate limit exceeded
  } else {
    // Generic fallback
  }
}`}
                />
            </section>

            <Separator className="my-10" />

            {/* Network Errors */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Network & timeout errors</h2>
                <p className="text-muted-foreground">
                    Network failures may occur when the client cannot reach the
                    API servers. These errors typically do not include a status
                    code.
                </p>

                <CodeHighlighter
                    code={`try {
  await sdk.courses.list();
} catch (error) {
  if (!error.statusCode) {
    console.error('Network error:', error.message);
  }
}`}
                />
            </section>

            <Separator className="my-10" />

            {/* Best Practices */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Best practices</h2>

                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Always wrap SDK calls in try/catch</li>
                    <li>Handle authentication errors explicitly</li>
                    <li>Implement retries for transient failures</li>
                    <li>Log errors for debugging and monitoring</li>
                    <li>Show user-friendly messages in production</li>
                </ul>
            </section>

            <Separator className="my-10" />

            {/* Footer */}
            <div className="mt-12 rounded-lg border bg-muted/40 p-5 max-w-3xl">
                <p className="text-sm text-muted-foreground">
                    👉{' '}
                    <span className="font-medium text-foreground">Next:</span>{' '}
                    Learn how usage limits work and how to avoid request
                    throttling in{' '}
                    <a
                        href="/api-docs/rate-limits"
                        className="text-primary hover:underline"
                    >
                        Rate Limits & Usage
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default ErrorHandling;
