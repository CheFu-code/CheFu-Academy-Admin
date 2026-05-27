import { SDK_URL } from '@/constants/Data';
import type { Metadata } from 'next';
import CodeHighlighter from '../_components/CodeHighlighter';
import { DocCallout, DocPage, DocSection } from '../_components/DocPage';

export function generateMetadata(): Metadata {
    return {
        title: 'Authentication | CheFu Academy Docs',
        description:
            'Authenticate CheFu Academy SDK requests with developer API keys and terminal user sessions.',
    };
}

const toc = [
    { title: 'Overview', href: '#overview' },
    { title: 'Developer API keys', href: '#developer-api-keys' },
    { title: 'Terminal sessions', href: '#terminal-sessions' },
    { title: 'Direct API calls', href: '#direct-api-calls' },
    { title: 'Security checklist', href: '#security-checklist' },
];

const Authentication = () => {
    return (
        <DocPage
            title="Authentication"
            description="CheFu Academy uses developer API keys for content access and user sessions for account-level actions such as creating or revoking keys."
            eyebrow="Core Concepts"
            toc={toc}
        >
            <DocSection id="overview" title="Overview">
                <p>
                    Most SDK reads are authenticated with an API key. Account
                    actions, such as creating or revoking keys, require a user
                    login session and are normally handled by the CLI.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <h3 className="font-semibold text-white">API key auth</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                            Used by <code>sdk.courses</code> and{' '}
                            <code>sdk.videos</code> methods.
                        </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                        <h3 className="font-semibold text-white">User auth</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                            Used by <code>sdk.keys</code> methods and CLI key
                            management commands.
                        </p>
                    </div>
                </div>
            </DocSection>

            <DocSection id="developer-api-keys" title="Developer API keys">
                <p>
                    API keys follow the format{' '}
                    <code>chf_publicId_secret</code>. The public identifier lets
                    the backend find the stored hash, while the secret portion is
                    verified without saving the raw key.
                </p>
                <CodeHighlighter
                    filename="server.ts"
                    code={`import CheFuAcademy from 'chefu-academy-sdk';

const sdk = new CheFuAcademy({
  apiKey: process.env.CHEFU_API_KEY,
});

const courses = await sdk.courses.getAll({ limit: 12 });`}
                />
                <DocCallout title="Use server-side environment variables" tone="amber">
                    Keep <code>CHEFU_API_KEY</code> in your server, deployment
                    secrets, or local <code>.env</code> file. Do not prefix it
                    with <code>NEXT_PUBLIC_</code> in Next.js apps.
                </DocCallout>
            </DocSection>

            <DocSection id="terminal-sessions" title="Terminal sessions">
                <p>
                    Login and registration are available directly from the CLI.
                    The CLI stores a local session for key management commands.
                </p>
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="Terminal"
                    code={`npx chefu-academy auth
npx chefu-academy login
npx chefu-academy register
npx chefu-academy whoami`}
                />
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="Terminal"
                    code={`npx chefu-academy keys create --name "Production"
npx chefu-academy keys list
npx chefu-academy keys revoke <key-id>`}
                />
            </DocSection>

            <DocSection id="direct-api-calls" title="Direct API calls">
                <p>
                    If you are not using the SDK, pass your API key in the
                    Authorization header as a bearer token.
                </p>
                <CodeHighlighter
                    code={`const response = await fetch('${SDK_URL}/api/courses?limit=10', {
  headers: {
    Authorization: \`Bearer \${process.env.CHEFU_API_KEY}\`,
  },
});

const data = await response.json();`}
                />
            </DocSection>

            <DocSection id="security-checklist" title="Security checklist">
                <ul className="list-disc space-y-2 pl-6">
                    <li>Use different keys for development and production.</li>
                    <li>Revoke keys immediately when a teammate leaves a project.</li>
                    <li>Never commit keys to GitHub or paste them in public logs.</li>
                    <li>Rotate keys after suspected exposure.</li>
                    <li>Use the CLI or dashboard to list and revoke keys.</li>
                </ul>
            </DocSection>
        </DocPage>
    );
};

export default Authentication;
