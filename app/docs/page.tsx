import type { Metadata } from 'next';
import Link from 'next/link';
import CodeHighlighter from './_components/CodeHighlighter';
import {
    DocCallout,
    DocPage,
    DocSection,
    MethodList,
} from './_components/DocPage';

export function generateMetadata(): Metadata {
    return {
        title: 'CheFu Academy Documentation',
        description:
            'Integrate CheFu Academy courses, videos, practice content, and developer API keys with the official SDK.',
    };
}

const toc = [
    { title: 'What is CheFu Academy?', href: '#what-is-chefu-academy' },
    { title: 'What you can build', href: '#what-you-can-build' },
    { title: 'Quick start', href: '#quick-start' },
    { title: 'Official clients', href: '#official-clients' },
    { title: 'Current SDK surface', href: '#current-sdk-surface' },
    { title: 'Security model', href: '#security-model' },
    { title: 'Next steps', href: '#next-steps' },
];

const methods = [
    {
        name: 'sdk.courses.*',
        description:
            'Browse, search, feature, and read course chapters, lessons, quizzes, flashcards, and Q&A.',
    },
    {
        name: 'sdk.videos.*',
        description:
            'Fetch uploaded and YouTube-backed videos, search them, or filter by category.',
    },
    {
        name: 'sdk.keys.*',
        description:
            'Create, list, and revoke developer API keys from authenticated SDK sessions.',
    },
    {
        name: 'chefu-academy CLI',
        description:
            'Login, register, logout, inspect your session, and manage keys from the terminal.',
    },
];

const APIDoc = () => {
    return (
        <DocPage
            title="CheFu Academy Docs"
            description="Build with the CheFu Academy platform using the official SDK clients, terminal CLI, and secured CheFu Inc API."
            eyebrow="SDK v1.0.10"
            toc={toc}
        >
            <DocSection
                id="what-is-chefu-academy"
                title="What is CheFu Academy?"
            >
                <p>
                    CheFu Academy is CheFu Inc&apos;s learning platform for
                    guided courses, learning videos, quizzes, flashcards, Q&A
                    practice, progress tracking, and AI-assisted course
                    generation.
                </p>
                <p>
                    The SDK gives developers a stable way to integrate that
                    learning content into internal tools, apps, bots,
                    dashboards, and custom education experiences.
                </p>
            </DocSection>

            <DocSection id="what-you-can-build" title="What you can build">
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        'Course discovery pages powered by CheFu Academy content.',
                        'Learning dashboards that pull chapters, lessons, and practice material.',
                        'Video libraries that include uploaded videos and YouTube-backed lessons.',
                        'Backend services that safely query CheFu Inc APIs with developer keys.',
                    ].map((item) => (
                        <div
                            key={item}
                            className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-zinc-300"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </DocSection>

            <DocSection id="quick-start" title="Quick start">
                <p>
                    Install the package, sign in from the terminal, create a
                    developer API key, and use that key from a server-side
                    environment.
                </p>
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="Terminal"
                    code={`npm install chefu-academy-sdk
npx chefu-academy login
npx chefu-academy keys create --name "Production API"`}
                />
                <CodeHighlighter
                    filename="server.ts"
                    code={`import CheFuAcademy from 'chefu-academy-sdk';

const sdk = new CheFuAcademy({
  apiKey: process.env.CHEFU_API_KEY,
});

const featuredCourses = await sdk.courses.getFeatured({ limit: 6 });
const videos = await sdk.videos.search({ query: 'javascript', limit: 8 });`}
                />
                <DocCallout title="Keep API keys on the server" tone="amber">
                    API keys use the format <code>chf_publicId_secret</code>. Do
                    not place them in client-side bundles or public
                    repositories.
                </DocCallout>
            </DocSection>

            <DocSection id="official-clients" title="Official clients">
                <p>
                    The JavaScript and TypeScript SDK is published on npm.
                    First-party Go, .NET, Ruby, and PHP packages are also
                    available from their registries, with Python, Java, and cURL
                    clients maintained in the SDK repository.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        'npm install chefu-academy-sdk',
                        'go get github.com/CheFu-code/chefu-academy-sdk/clients/go@v0.1.0',
                        'dotnet add package CheFu.Academy --version 0.1.0',
                        'gem install chefu_academy -v 0.1.0',
                        'composer require chefu/academy',
                    ].map((command) => (
                        <code
                            key={command}
                            className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-sky-300"
                        >
                            {command}
                        </code>
                    ))}
                </div>
                <Link
                    href="/docs/languages"
                    className="inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.04] hover:text-white"
                >
                    View all SDK languages
                </Link>
            </DocSection>

            <DocSection id="current-sdk-surface" title="Current SDK surface">
                <MethodList items={methods} />
            </DocSection>

            <DocSection id="security-model" title="Security model">
                <p>
                    Developer keys are created only by authenticated users with
                    the developer role. The backend validates that keys start
                    with <code>chf_</code>, checks the public identifier, hashes
                    the secret portion, and rejects revoked or compromised keys.
                </p>
                <p>
                    If a key is reported as leaked, CheFu Inc can revoke it and
                    notify the owner so they can rotate credentials quickly.
                </p>
            </DocSection>

            <DocSection id="next-steps" title="Next steps">
                <div className="grid gap-3 sm:grid-cols-3">
                    <Link
                        href="/docs/installation"
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                        Install the SDK
                    </Link>
                    <Link
                        href="/docs/authentication"
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                        Understand auth
                    </Link>
                    <Link
                        href="/docs/languages"
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                        SDK languages
                    </Link>
                    <Link
                        href="/docs/requests"
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                        View SDK methods
                    </Link>
                </div>
            </DocSection>
        </DocPage>
    );
};

export default APIDoc;
