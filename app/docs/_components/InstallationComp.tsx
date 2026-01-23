import { Separator } from '@/components/ui/separator';
import { ApiKey } from '@/types/keys';
import { Dispatch, SetStateAction } from 'react';
import CodeHighlighter from './CodeHighlighter';
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
        <div>
            {/* Why API Keys */}
            <section className="space-y-4 max-w-3xl">
                <h2 className="text-xl font-bold">Why API keys are required</h2>
                <p className="text-muted-foreground leading-relaxed">
                    The CheFu Academy SDK uses API keys to authenticate requests
                    and associate them with your account. This ensures secure
                    access, usage tracking, and abuse prevention.
                </p>

                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Each API key is unique to your account</li>
                    <li>Keys can be revoked at any time</li>
                    <li>Never expose keys in public repositories</li>
                </ul>
            </section>
            <Separator className="my-10" />
            {/* Install SDK */}
            <section className="space-y-4 max-w-3xl">
                <h2 className="text-xl font-bold">Install the SDK</h2>
                <p className="text-muted-foreground">
                    Install the official CheFu Academy SDK using npm.
                </p>

                <CodeHighlighter code={`npm install chefu-academy-sdk`} />
            </section>
            <Separator className="my-10" />
            {/* Usage Example */}
            <section className="space-y-4 max-w-3xl">
                <h2 className="text-xl font-bold">Basic usage</h2>
                <p className="text-muted-foreground">
                    Initialize the SDK with your API key and start fetching
                    content.
                </p>

                <CodeHighlighter
                    code={`import CheFuAcademy from 'chefu-academy-sdk';

const sdk = new CheFuAcademy({
apiKey: process.env.CHEFU_API_KEY,
});

const courses = await sdk.courses.getAll();
console.log(courses);`}
                />
            </section>
            <Separator className="my-10" />
            {/* API Key Management */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold">API key management</h2>
                <p className="text-muted-foreground max-w-3xl">
                    Create, view, and revoke API keys below. A generated key
                    will only be shown once — store it securely.
                </p>

                <TableComp
                    setOpen={setOpen}
                    loading={loading}
                    keys={keys}
                    revokeKey={revokeKey}
                />
            </section>

            <p className="mt-10 text-sm text-muted-foreground">
                Next up →{' '}
                <a
                    href="/docs/authentication"
                    className="text-primary hover:underline"
                >
                    Authentication & Core Concepts
                </a>
            </p>
        </div>
    );
};

export default InstallationComp;
