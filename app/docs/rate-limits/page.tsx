'use client';

import Header from '@/components/Shared/Header';
import { Separator } from '@/components/ui/separator';
import CodeHighlighter from '../_components/CodeHighlighter';

const RateLimits = () => {
    return (
        <div className="min-h-screen bg-background pb-15">
            <Header
                header="Rate Limits & Usage"
                description="Understand request limits, throttling behavior, and best practices to avoid exceeding your quota."
            />

            <Separator className="my-10" />

            {/* Overview */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                    The CheFu Academy API enforces rate limits to ensure fair
                    usage, prevent abuse, and maintain platform stability. Each
                    API key has a maximum number of requests per minute and per
                    day.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    Exceeding these limits will result in{' '}
                    <code className="font-mono">429 Too Many Requests</code>{' '}
                    errors.
                </p>
            </section>

            <Separator className="my-10" />

            {/* Typical Limits */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Typical limits</h2>
                <p className="text-muted-foreground">
                    While limits may vary depending on account type, a standard
                    API key has:
                </p>

                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>60 requests per minute</li>
                    <li>10,000 requests per day</li>
                    <li>Concurrent requests: up to 5 per key</li>
                </ul>
            </section>

            <Separator className="my-10" />

            {/* Detecting Limits */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Detecting rate limits</h2>
                <p className="text-muted-foreground">
                    When you exceed the limit, the SDK or API will return a{' '}
                    <code className="font-mono">429</code> HTTP status code. The
                    response includes information on when you can retry.
                </p>

                <CodeHighlighter
                    code={`{
  statusCode: 429,
  message: "Rate limit exceeded",
  retryAfter: 30 // seconds
}`}
                />
            </section>

            <Separator className="my-10" />

            {/* Retry Strategies */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Retry strategies</h2>
                <p className="text-muted-foreground">
                    Implement retries with exponential backoff to handle
                    transient rate-limit errors.
                </p>

                <CodeHighlighter
                    code={`async function fetchCoursesWithRetry(sdk, retries = 3) {
  try {
    return await sdk.courses.list();
  } catch (error) {
    if (error.statusCode === 429 && retries > 0) {
      await new Promise(res => setTimeout(res, 1000 * (4 - retries)));
      return fetchCoursesWithRetry(sdk, retries - 1);
    }
    throw error;
  }
}`}
                />
            </section>

            <Separator className="my-10" />

            {/* Best Practices */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Best practices</h2>

                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>
                        Reuse the SDK instance instead of creating multiple
                        instances
                    </li>
                    <li>Cache repeated requests when possible</li>
                    <li>
                        Use pagination to limit the size of data per request
                    </li>
                    <li>
                        Monitor your request counts to avoid exceeding daily
                        limits
                    </li>
                    <li>
                        Handle <code className="font-mono">429</code> errors
                        gracefully
                    </li>
                </ul>
            </section>

            <Separator className="my-10" />

            {/* Footer */}
            {/* <div className="mt-12 rounded-lg border bg-muted/40 p-5 max-w-3xl">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    👉{' '}
                    <span className="font-medium text-foreground">Next:</span>{' '}
                    Learn about best practices for securing your keys and
                    preventing misuse in the{' '}
                    <a
                        href="/docs/security"
                        className="text-primary hover:underline"
                    >
                        Security & Best Practices
                    </a>{' '}
                    section.
                </p>
            </div> */}
        </div>
    );
};

export default RateLimits;
