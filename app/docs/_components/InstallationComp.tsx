import { Button } from '@/components/ui/button';
import { ApiKey } from '@/types/keys';
import { Dispatch, SetStateAction } from 'react';
import CodeHighlighter from './CodeHighlighter';
import { DocCallout, DocSection } from './DocPage';
import LanguageExamplePicker from './LanguageExamplePicker';
import TableComp from './Table';
import { courseRequestExamples, installExamples } from './languageExamples';

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
                    Choose the language you want to use. The same choice carries
                    across the docs so authentication, requests, errors, and
                    retries all show matching examples.
                </p>
                <LanguageExamplePicker
                    title="Install CheFu Academy"
                    description="Every official client talks to the same CheFu Inc API and uses the same bearer-token security model."
                    examples={installExamples}
                />
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
                <LanguageExamplePicker
                    title="Search courses"
                    description="Use your selected SDK to make the first real content request."
                    examples={courseRequestExamples}
                />
            </DocSection>
        </>
    );
};

export default InstallationComp;
