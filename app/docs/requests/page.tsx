'use client';

import Header from '@/components/Shared/Header';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import CodeHighlighter from '../_components/CodeHighlighter';

const MakingRequests = () => {
    return (
        <div className="min-h-screen bg-background pb-20">
            <Header
                header="Making Requests"
                description="Learn how to fetch data, handle responses, and manage errors using the CheFu Academy SDK."
            />

            <Separator className="my-10" />

            {/* Overview */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Once authentication is set up, you can start making requests
                    to the CheFu Academy API. The SDK provides a clean,
                    promise-based interface for accessing platform resources
                    such as courses, chapters, quizzes, and flashcards.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                    All SDK methods return structured responses and throw errors
                    when requests fail.
                </p>
            </section>

            <Separator className="my-10" />

            {/* Basic Request */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Basic request</h2>
                <p className="text-muted-foreground">
                    Use the SDK to fetch all of available courses.
                </p>

                <CodeHighlighter
                    code={`import CheFuAcademy from 'chefu-academy-sdk';

const sdk = new CheFuAcademy({
  apiKey: process.env.MY_API_KEY,
});

const courses = await sdk.courses.getAll();
console.log(courses);`}
                />
            </section>

            <Separator className="my-10" />

            {/* Parameters */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Passing parameters</h2>
                <p className="text-muted-foreground">
                    Many SDK methods accept parameters for filtering,
                    pagination, or sorting.
                </p>

                <CodeHighlighter
                    code={`const courses = await sdk.courses.getAll({
  page: 1,
  limit: 10,
  category: 'programming',
});`}
                />
            </section>

            <Separator className="my-10" />

            {/* Single Resource */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">
                    Fetching a single resource
                </h2>
                <p className="text-muted-foreground">
                    Retrieve a single course or chapter by its unique ID.
                </p>

                <CodeHighlighter
                    code={`const course = await sdk.courses.getById('course_id');

const chapters = await sdk.chapters.list({
  courseId: 'course_id',
});`}
                />
            </section>

            <Separator className="my-10" />

            {/* Error Handling */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Handling errors</h2>
                <p className="text-muted-foreground">
                    All SDK methods throw errors when a request fails. Always
                    wrap requests in a try/catch block.
                </p>

                <CodeHighlighter
                    code={`try {
  const courses = await sdk.courses.getAll();
} catch (error) {
  console.error(error.message);
}`}
                />

                <div className="space-y-2 text-muted-foreground">
                    <p>
                        <strong className="text-foreground">400</strong> –
                        Invalid request
                    </p>
                    <p>
                        <strong className="text-foreground">401</strong> –
                        Unauthorized
                    </p>
                    <p>
                        <strong className="text-foreground">404</strong> –
                        Resource not found
                    </p>
                    <p>
                        <strong className="text-foreground">500</strong> –
                        Server error
                    </p>
                </div>
            </section>

            <Separator className="my-10" />

            {/* Async Patterns */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Async usage patterns</h2>
                <p className="text-muted-foreground">
                    The SDK is asynchronous and works well with modern React,
                    Node.js, and serverless environments.
                </p>

                <CodeHighlighter
                    code={`// React example
useEffect(() => {
  sdk.courses.getAll().then(setCourses);
}, []);`}
                />
            </section>

            <Separator className="my-10" />

            {/* Performance */}
            <section className="max-w-3xl space-y-4">
                <h2 className="text-xl font-bold">Performance tips</h2>

                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Reuse the SDK instance across your app</li>
                    <li>Avoid unnecessary repeated requests</li>
                    <li>Cache responses when possible</li>
                    <li>Paginate large datasets</li>
                </ul>
            </section>

            <Separator className="my-10" />

            {/* Footer */}
            <div className="mt-12 rounded-lg border bg-muted/40 p-5 max-w-3xl">
                <p className="text-sm text-muted-foreground leading-relaxed">
                    👉{' '}
                    <span className="font-medium text-foreground">Next:</span>{' '}
                    Learn how to detect failures, interpret SDK errors, and
                    handle edge cases gracefully in the{' '}
                    <a
                        href="/docs/error-handling"
                        className="text-primary hover:underline"
                    >
                        Error Handling
                    </a>{' '}
                    section.
                </p>
            </div>
        </div>
    );
};

export default MakingRequests;
