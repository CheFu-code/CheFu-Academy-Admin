import { Button } from '@/components/ui/button';
import { ApiKey } from '@/types/keys';
import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import CodeHighlighter from './CodeHighlighter';
import { DocCallout, DocSection } from './DocPage';
import TableComp from './Table';

const InstallationComp = ({
    setOpen,
    loading,
    keys,
    revokeKey,
}: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    keys: ApiKey[];
    revokeKey: (id: string) => Promise<void>;
}) => {
    return (
        <>
            <DocSection id="install-package" title="Install the package">
                <p>
                    The JavaScript and TypeScript SDK supports Node.js 18 and
                    newer. Install it in the project that will call the CheFu
                    Inc API.
                </p>
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="npm"
                    code="npm install chefu-academy-sdk"
                />
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="yarn"
                    code="yarn add chefu-academy-sdk"
                />
            </DocSection>

            <DocSection id="other-sdk-languages" title="Other SDK languages">
                <p>
                    CheFu Academy also publishes official clients for Go, .NET,
                    and Ruby. Python, Java, PHP, and cURL clients are maintained
                    in the SDK repository while their registry setup is
                    completed.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        'go get github.com/CheFu-code/chefu-academy-sdk/clients/go@v0.1.0',
                        'dotnet add package CheFu.Academy --version 0.1.0',
                        'gem install chefu_academy -v 0.1.0',
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
                    View SDK language docs
                </Link>
            </DocSection>

            <DocSection id="terminal-auth" title="Login from the terminal">
                <p>
                    The package includes a CLI for developer setup. Use it to
                    login, register, inspect your current session, and logout.
                </p>
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="Terminal"
                    code={`npx chefu-academy auth
npx chefu-academy login
npx chefu-academy whoami
npx chefu-academy logout`}
                />
                <DocCallout title="Developer role required" tone="blue">
                    API key creation is only available after authentication and
                    only for users marked as developers in CheFu Inc.
                </DocCallout>
            </DocSection>

            <DocSection id="create-api-key" title="Create an API key">
                <p>
                    Create a key from the CLI or from this page. A generated key
                    is shown once, so store it in a secret manager or
                    environment variable immediately.
                </p>
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="Terminal"
                    code={`npx chefu-academy keys create --name "Local development"
npx chefu-academy keys list
npx chefu-academy keys revoke <key-id>`}
                />
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="font-semibold text-white">
                                Dashboard keys
                            </h3>
                            <p className="mt-1 text-sm text-zinc-400">
                                Manage API keys connected to the signed-in web
                                account.
                            </p>
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            className="w-fit cursor-pointer"
                            onClick={() => setOpen(true)}
                        >
                            Create API Key
                        </Button>
                    </div>
                    <TableComp
                        setOpen={setOpen}
                        loading={loading}
                        keys={keys}
                        revokeKey={revokeKey}
                    />
                </div>
            </DocSection>

            <DocSection id="use-sdk" title="Use the SDK">
                <p>
                    Initialize the SDK once in server-side code and reuse the
                    instance for courses, videos, and other content calls.
                </p>
                <CodeHighlighter
                    filename="server.ts"
                    code={`import CheFuAcademy from 'chefu-academy-sdk';

const sdk = new CheFuAcademy({
  apiKey: process.env.CHEFU_API_KEY,
});

const courses = await sdk.courses.search({
  query: 'react',
  category: 'Programming',
  limit: 10,
});

console.log(courses);`}
                />
            </DocSection>
        </>
    );
};

export default InstallationComp;
