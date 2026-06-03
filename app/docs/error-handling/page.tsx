import type { Metadata } from 'next';
import { DocCallout, DocPage, DocSection } from '../_components/DocPage';
import LanguageExamplePicker from '../_components/LanguageExamplePicker';
import { errorHandlingExamples } from '../_components/languageExamples';

export function generateMetadata(): Metadata {
    return {
        title: 'Error Handling | CheFu Academy Docs',
        description:
            'Handle CheFu Academy SDK errors, HTTP status codes, network failures, and retryable requests.',
    };
}

const toc = [
    { title: 'Overview', href: '#overview' },
    { title: 'Error types', href: '#error-types' },
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
                    All official clients raise a language-native SDK error when
                    the API returns a non-2xx response. The error includes a
                    message and status code so your app can handle
                    authentication, validation, throttling, and server failures
                    deliberately.
                </p>
            </DocSection>

            <DocSection id="error-types" title="Error types">
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        ['JavaScript / TypeScript', 'CheFuAcademyError'],
                        ['Python', 'CheFuAcademyError'],
                        ['Go', '*chefuacademy.Error'],
                        ['Java', 'CheFuAcademyException'],
                        ['.NET', 'CheFuAcademyException'],
                        ['PHP', 'CheFuAcademyException'],
                        ['Ruby', 'CheFuAcademy::Error'],
                        ['cURL', 'HTTP status + response body'],
                    ].map(([language, errorType]) => (
                        <div
                            key={language}
                            className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                        >
                            <p className="text-sm font-semibold text-white">
                                {language}
                            </p>
                            <code className="mt-2 block text-sm text-sky-300">
                                {errorType}
                            </code>
                        </div>
                    ))}
                </div>
            </DocSection>

            <DocSection id="common-status-codes" title="Common status codes">
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        ['400', 'Invalid request or malformed parameters.'],
                        [
                            '401',
                            'Missing, invalid, or expired API key or user session.',
                        ],
                        [
                            '403',
                            'Revoked key or insufficient developer permissions.',
                        ],
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
                <LanguageExamplePicker
                    title="Catch SDK errors"
                    description="Branch on status code for recovery paths, but keep detailed logs private."
                    examples={errorHandlingExamples}
                />
                <DocCallout
                    title="Network errors may not include a status code"
                    tone="neutral"
                >
                    Treat errors without <code>statusCode</code> as
                    connectivity, DNS, timeout, or local environment problems.
                </DocCallout>
            </DocSection>

            <DocSection id="production-guidance" title="Production guidance">
                <ul className="list-disc space-y-2 pl-6">
                    <li>
                        Show user-friendly messages and log detailed errors
                        privately.
                    </li>
                    <li>
                        Retry only safe read operations, and use backoff for 429
                        or transient 5xx errors.
                    </li>
                    <li>
                        Do not log full API keys, passwords, or bearer tokens.
                    </li>
                    <li>
                        Fail closed when authentication or permissions are
                        unclear.
                    </li>
                </ul>
            </DocSection>
        </DocPage>
    );
};

export default ErrorHandling;
