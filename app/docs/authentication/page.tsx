'use client';

import Header from '@/components/Shared/Header';
import { Separator } from '@/components/ui/separator';
import { SDK_URL } from '@/constants/Data';
import React from 'react';
import CodeHighlighter from '../_components/CodeHighlighter';

const Authentication = () => {
    return (
        <div className="min-h-screen bg-background pb-20">
            <Header
                header="Authentication"
                description="Understand how CheFu Academy authenticates requests and secures your API access."
            />

            <Separator className="my-10" />

            {/* Overview */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                    The CheFu Academy SDK uses API key–based authentication to
                    identify your application and authorize access to protected
                    resources. Every request made through the SDK or directly to
                    the API must include a valid API key.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    Authentication is handled automatically by the SDK once your
                    API key is provided during initialization.
                </p>
            </section>

            <Separator className="my-10" />

            {/* How it works */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">How authentication works</h2>

                <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                    <li>You generate an API key from the dashboard.</li>
                    <li>The key is passed to the SDK during initialization.</li>
                    <li>The SDK attaches the key to every outgoing request.</li>
                    <li>
                        The server validates the key and authorizes the request.
                    </li>
                </ol>
            </section>

            <Separator className="my-10" />

            {/* Using the SDK */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">
                    Authenticating with the SDK
                </h2>
                <p className="text-muted-foreground">
                    Initialize the SDK once and reuse the instance throughout
                    your application.
                </p>

                <CodeHighlighter
                    code={`import CheFuAcademy from 'chefu-academy-sdk';
import React from 'react';

const Example = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const Auth = async () => {
    try {
      const authenticate = new CheFuAcademy({
        apiKey: process.env.MY_API_KEY,
      });

      const res = await authenticate.auth.login(email, password);
      console.log('Response:', res.data());
    } catch (error) {
      console.error(error);
    }
  };
};

export default Example;`}
                />
            </section>

            <Separator className="my-10" />

            {/* Direct API */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Direct API authentication</h2>
                <p className="text-muted-foreground">
                    If you are not using the SDK, you must manually include your
                    API key in the{' '}
                    <code className="font-mono">Authorization</code> header.
                </p>

                <CodeHighlighter
                    code={`fetch('${SDK_URL}/courses', {
  headers: {
    Authorization: 'Bearer YOUR_API_KEY',
  },
});`}
                />
            </section>

            <Separator className="my-10" />

            {/* Security */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Security best practices</h2>

                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Store API keys in environment variables</li>
                    <li>Never commit keys to source control</li>
                    <li>Rotate keys regularly</li>
                    <li>Revoke compromised keys immediately</li>
                    <li>Use different keys for development and production</li>
                </ul>
            </section>

            <Separator className="my-10" />

            {/* Common errors */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">
                    Common authentication errors
                </h2>

                <div className="space-y-3 text-muted-foreground">
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
                        – Key is revoked or lacks required permissions.
                    </p>
                    <p>
                        <strong className="text-foreground">
                            429 Too Many Requests
                        </strong>{' '}
                        – Rate limit exceeded.
                    </p>
                </div>
            </section>

            <Separator className="my-10" />

            {/* Footer note */}
            <div className="mt-12 rounded-lg border bg-muted/40 p-5 max-w-3xl">
                <p className="text-sm text-muted-foreground">
                    👉{' '}
                    <span className="font-medium text-foreground">Next:</span>{' '}
                    Learn how to structure requests, handle responses, and work
                    with SDK methods in{' '}
                    <a
                        href="/docs/requests"
                        className="text-primary hover:underline"
                    >
                        Making Requests
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default Authentication;
