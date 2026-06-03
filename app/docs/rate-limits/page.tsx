import type { Metadata } from 'next';
import CodeHighlighter from '../_components/CodeHighlighter';
import { DocCallout, DocPage, DocSection } from '../_components/DocPage';
import LanguageExamplePicker from '../_components/LanguageExamplePicker';
import { retryExamples } from '../_components/languageExamples';

export function generateMetadata(): Metadata {
    return {
        title: 'Rate Limits | CheFu Academy Docs',
        description:
            'Understand CheFu Academy API usage limits, 429 responses, caching, and retry best practices.',
    };
}

const toc = [
    { title: 'Overview', href: '#overview' },
    { title: 'How to reduce requests', href: '#reduce-requests' },
    { title: 'Retry strategy', href: '#retry-strategy' },
    { title: 'Recommended caching', href: '#recommended-caching' },
];

const RateLimits = () => {
    return (
        <DocPage
            title="Rate Limits & Usage"
            description="Build integrations that are fast, respectful of shared platform resources, and resilient when traffic spikes."
            eyebrow="Reliability"
            toc={toc}
        >
            <DocSection id="overview" title="Overview">
                <p>
                    CheFu Academy may throttle traffic to protect platform
                    stability. If a client sends too many requests, the API can
                    respond with <code>429 Too Many Requests</code>.
                </p>
                <DocCallout
                    title="Limits can vary by plan and endpoint"
                    tone="blue"
                >
                    Design your app to handle <code>429</code> even when you do
                    not normally reach the limit during development.
                </DocCallout>
            </DocSection>

            <DocSection id="reduce-requests" title="How to reduce requests">
                <ul className="list-disc space-y-2 pl-6">
                    <li>
                        Reuse one SDK instance instead of recreating it for
                        every call.
                    </li>
                    <li>
                        Use <code>limit</code> to request only the data you
                        need.
                    </li>
                    <li>
                        Cache categories, featured courses, and stable video
                        lists.
                    </li>
                    <li>
                        Fetch detailed course content only after a user opens a
                        course.
                    </li>
                    <li>
                        Avoid sending a search request on every keystroke
                        without debouncing.
                    </li>
                </ul>
            </DocSection>

            <DocSection id="retry-strategy" title="Retry strategy">
                <p>
                    Retry safe read operations with a small delay and backoff.
                    Do not retry forever.
                </p>
                <LanguageExamplePicker
                    title="Retry safe read operations"
                    description="Retry idempotent reads such as course and video lookups. Do not retry key creation blindly."
                    examples={retryExamples}
                />
            </DocSection>

            <DocSection id="recommended-caching" title="Recommended caching">
                <p>
                    For Next.js apps, keep SDK calls server-side and use the
                    framework&apos;s caching tools around your own route
                    handlers or Server Components.
                </p>
                <CodeHighlighter
                    filename="app/api/academy/featured/route.ts"
                    code={`export const revalidate = 300;

export async function GET() {
  const courses = await sdk.courses.getFeatured({ limit: 6 });
  return Response.json(courses);
}`}
                />
            </DocSection>
        </DocPage>
    );
};

export default RateLimits;
