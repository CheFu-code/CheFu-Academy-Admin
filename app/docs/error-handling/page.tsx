import type { Metadata } from 'next';
import CodeHighlighter from '../_components/CodeHighlighter';
import { DocCallout, DocPage, DocSection } from '../_components/DocPage';

export function generateMetadata(): Metadata {
    return {
        title: 'Error Handling | CheFu Academy Docs',
        description:
            'Handle CheFu Academy SDK errors, HTTP status codes, network failures, and retryable requests.',
    };
}

const toc = [
    { title: 'Overview', href: '#overview' },
    { title: 'CheFuAcademyError', href: '#chefuacademyerror' },
    { title: 'Common status codes', href: '#common-status-codes' },
    { title: 'Handling failures', href: '#handling-failures' },
    { title: 'Production guidance', href: '#production-guidance' },
];

const ErrorHandling = () => {
    return (
        <DocPage
            title="Error Handling"
            description="SDK requests throw typed errors so your app can respond cleanly to invalid input, auth failures, missing resources, and temporary platform issues."
            eyebrow="Reliability"
            toc={toc}
        >
            <DocSection id="overview" title="Overview">
                <p>
                    All SDK methods return promises. When a request fails, the
                    SDK throws <code>CheFuAcademyError</code> with a user-friendly
                    message, optional status code, and optional response details.
                </p>
            </DocSection>

            <DocSection id="chefuacademyerror" title="CheFuAcademyError">
                <CodeHighlighter
                    filename="error-shape.ts"
                    code={`class CheFuAcademyError extends Error {
  name: 'CheFuAcademyError';
  message: string;
  statusCode?: number;
  details?: unknown;
}`}
                />
            </DocSection>

            <DocSection id="common-status-codes" title="Common status codes">
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        ['400', 'Invalid request or malformed parameters.'],
                        ['401', 'Missing, invalid, or expired API key or user session.'],
                        ['403', 'Revoked key or insufficient developer permissions.'],
                        ['404', 'The course, video, or key was not found.'],
                        ['429', 'Rate limit exceeded. Retry after waiting.'],
                        ['500', 'Unexpected CheFu Academy server issue.'],
                    ].map(([code, description]) => (
                        <div
                            key={code}
                            className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                        >
                            <code className="text-lg text-sky-300">{code}</code>
                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </DocSection>

            <DocSection id="handling-failures" title="Handling failures">
                <p>
                    Use <code>try/catch</code> around SDK calls and branch on
                    <code>statusCode</code> when your app needs a specific
                    recovery path.
                </p>
                <CodeHighlighter
                    filename="error-handling.ts"
                    code={`import { CheFuAcademyError } from 'chefu-academy-sdk';

try {
  const courses = await sdk.courses.getAll({ limit: 12 });
  return courses;
} catch (error) {
  if (error instanceof CheFuAcademyError) {
    if (error.statusCode === 401) {
      throw new Error('Check your CHEFU_API_KEY environment variable.');
    }

    if (error.statusCode === 429) {
      throw new Error('Too many requests. Retry shortly.');
    }

    throw new Error(error.message);
  }

  throw error;
}`}
                />
                <DocCallout title="Network errors may not include a status code" tone="neutral">
                    Treat errors without <code>statusCode</code> as connectivity,
                    DNS, timeout, or local environment problems.
                </DocCallout>
            </DocSection>

            <DocSection id="production-guidance" title="Production guidance">
                <ul className="list-disc space-y-2 pl-6">
                    <li>Show user-friendly messages and log detailed errors privately.</li>
                    <li>Retry only safe read operations, and use backoff for 429 or transient 5xx errors.</li>
                    <li>Do not log full API keys, passwords, or bearer tokens.</li>
                    <li>Fail closed when authentication or permissions are unclear.</li>
                </ul>
            </DocSection>
        </DocPage>
    );
};

export default ErrorHandling;
