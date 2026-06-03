import type { Metadata } from 'next';
import Link from 'next/link';
import CodeHighlighter from '../_components/CodeHighlighter';
import { DocCallout, DocPage, DocSection } from '../_components/DocPage';

export function generateMetadata(): Metadata {
    return {
        title: 'SDK Languages | CheFu Academy Docs',
        description:
            'Install the official CheFu Academy SDK clients for JavaScript, TypeScript, Go, .NET, Ruby, and source-ready clients for more languages.',
    };
}

const toc = [
    { title: 'Published packages', href: '#published-packages' },
    { title: 'JavaScript and TypeScript', href: '#javascript-typescript' },
    { title: 'Go', href: '#go' },
    { title: '.NET', href: '#dotnet' },
    { title: 'Ruby', href: '#ruby' },
    { title: 'Source clients', href: '#source-clients' },
    { title: 'Authentication', href: '#authentication' },
];

const publishedClients = [
    {
        language: 'JavaScript / TypeScript',
        packageName: 'chefu-academy-sdk',
        version: '1.0.10',
        registry: 'npm',
        install: 'npm install chefu-academy-sdk',
        status: 'Published',
    },
    {
        language: 'Go',
        packageName: 'github.com/CheFu-code/chefu-academy-sdk/clients/go',
        version: '0.1.0',
        registry: 'Go module proxy',
        install:
            'go get github.com/CheFu-code/chefu-academy-sdk/clients/go@v0.1.0',
        status: 'Published',
    },
    {
        language: '.NET',
        packageName: 'CheFu.Academy',
        version: '0.1.0',
        registry: 'NuGet',
        install: 'dotnet add package CheFu.Academy --version 0.1.0',
        status: 'Published',
    },
    {
        language: 'Ruby',
        packageName: 'chefu_academy',
        version: '0.1.0',
        registry: 'RubyGems',
        install: 'gem install chefu_academy -v 0.1.0',
        status: 'Published',
    },
    {
        language: 'PHP',
        packageName: 'chefu/academy',
        version: '0.1.0',
        registry: 'Packagist',
        install: 'composer require chefu/academy',
        status: 'Published',
    },
];

const sourceClients = [
    {
        language: 'Python',
        packageName: 'chefu-academy',
        path: 'clients/python',
        registry: 'PyPI',
        status: 'Source-ready; registry publish pending',
    },
    {
        language: 'Java',
        packageName: 'com.chefu:chefu-academy',
        path: 'clients/java',
        registry: 'Maven Central',
        status: 'Source-ready; registry publish pending',
    },
    {
        language: 'cURL',
        packageName: 'chefu-academy.sh',
        path: 'clients/curl',
        registry: 'Repository helper',
        status: 'Available in the SDK source and npm package',
    },
];

const Languages = () => {
    return (
        <DocPage
            title="SDK Languages"
            description="Use CheFu Academy from the official TypeScript SDK and the first-party clients we publish or maintain for other ecosystems."
            eyebrow="Official SDKs"
            toc={toc}
        >
            <DocSection id="published-packages" title="Published packages">
                <p>
                    These clients are available from their public package
                    registries today.
                </p>
                <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                    <div className="grid grid-cols-1 border-b border-white/10 text-sm font-semibold text-zinc-400 md:grid-cols-[1.1fr_1.5fr_.7fr_.9fr]">
                        <div className="px-4 py-3">Language</div>
                        <div className="px-4 py-3">Package</div>
                        <div className="px-4 py-3">Version</div>
                        <div className="px-4 py-3">Registry</div>
                    </div>
                    {publishedClients.map((client) => (
                        <div
                            key={client.packageName}
                            className="grid grid-cols-1 border-b border-white/10 text-sm last:border-b-0 md:grid-cols-[1.1fr_1.5fr_.7fr_.9fr]"
                        >
                            <div className="px-4 py-3 text-white">
                                {client.language}
                            </div>
                            <code className="break-words px-4 py-3 text-sky-300">
                                {client.packageName}
                            </code>
                            <div className="px-4 py-3 text-zinc-300">
                                {client.version}
                            </div>
                            <div className="px-4 py-3 text-zinc-300">
                                {client.registry}
                            </div>
                        </div>
                    ))}
                </div>
            </DocSection>

            <DocSection
                id="javascript-typescript"
                title="JavaScript and TypeScript"
            >
                <p>
                    Use the npm package for Node.js, Next.js route handlers,
                    server actions, backend services, and TypeScript projects.
                </p>
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="Terminal"
                    code="npm install chefu-academy-sdk"
                />
                <CodeHighlighter
                    filename="server.ts"
                    code={`import CheFuAcademy from 'chefu-academy-sdk';

const sdk = new CheFuAcademy({
  apiKey: process.env.CHEFU_API_KEY,
});

const courses = await sdk.courses.getFeatured({ limit: 6 });`}
                />
            </DocSection>

            <DocSection id="go" title="Go">
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="Terminal"
                    code="go get github.com/CheFu-code/chefu-academy-sdk/clients/go@v0.1.0"
                />
                <CodeHighlighter
                    language="go"
                    filename="main.go"
                    code={`client := chefuacademy.NewClient(chefuacademy.Config{
    APIKey: os.Getenv("CHEFU_API_KEY"),
})

courses, err := client.ListCourses(
    context.Background(),
    chefuacademy.ListOptions{Limit: 5},
)`}
                />
            </DocSection>

            <DocSection id="dotnet" title=".NET">
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="Terminal"
                    code="dotnet add package CheFu.Academy --version 0.1.0"
                />
                <CodeHighlighter
                    language="csharp"
                    filename="Program.cs"
                    code={`var client = new CheFuAcademyClient(
    apiKey: Environment.GetEnvironmentVariable("CHEFU_API_KEY")
);

var courses = await client.ListCoursesAsync(new Dictionary<string, object?>
{
    ["limit"] = 5,
});`}
                />
            </DocSection>

            <DocSection id="ruby" title="Ruby">
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="Terminal"
                    code="gem install chefu_academy -v 0.1.0"
                />
                <CodeHighlighter
                    language="ruby"
                    filename="app.rb"
                    code={`client = CheFuAcademy::Client.new(
  api_key: ENV['CHEFU_API_KEY']
)

courses = client.list_courses(limit: 5)`}
                />
            </DocSection>

            <DocSection id="source-clients" title="Source clients">
                <p>
                    Python, Java, and cURL clients are maintained in the SDK
                    repository while their dedicated registry setup is
                    completed.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    {sourceClients.map((client) => (
                        <div
                            key={client.packageName}
                            className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-white">
                                        {client.language}
                                    </h3>
                                    <code className="mt-2 block break-words text-sm text-sky-300">
                                        {client.packageName}
                                    </code>
                                </div>
                                <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-400">
                                    {client.registry}
                                </span>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-zinc-400">
                                {client.status}
                            </p>
                            <p className="mt-2 text-sm text-zinc-500">
                                Source path: <code>{client.path}</code>
                            </p>
                        </div>
                    ))}
                </div>
                <DocCallout
                    title="Registry releases still need their own setup"
                    tone="blue"
                >
                    PyPI and Maven Central require account, namespace, or
                    signing configuration before those packages can be published
                    from the official CheFu accounts.
                </DocCallout>
            </DocSection>

            <DocSection id="authentication" title="Authentication">
                <p>
                    All official clients use the same CheFu Inc API and the same
                    bearer token model. Course and video reads use a developer
                    API key. Account-level key management uses a user auth
                    token.
                </p>
                <CodeHighlighter
                    language="http"
                    showLineNumbers={false}
                    filename="Authorization"
                    code="Authorization: Bearer chf_publicId_secret"
                />
                <p>
                    Create and rotate developer keys from the{' '}
                    <Link
                        href="/docs/installation"
                        className="font-medium text-sky-300 hover:text-sky-200"
                    >
                        Installation
                    </Link>{' '}
                    page.
                </p>
            </DocSection>
        </DocPage>
    );
};

export default Languages;
