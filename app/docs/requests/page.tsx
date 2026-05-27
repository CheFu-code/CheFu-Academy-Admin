import type { Metadata } from 'next';
import CodeHighlighter from '../_components/CodeHighlighter';
import { DocCallout, DocPage, DocSection, MethodList } from '../_components/DocPage';

export function generateMetadata(): Metadata {
    return {
        title: 'Making Requests | CheFu Academy Docs',
        description:
            'Use the CheFu Academy SDK to query courses, videos, chapters, lessons, quizzes, flashcards, Q&A, and API keys.',
    };
}

const toc = [
    { title: 'Create the client', href: '#create-the-client' },
    { title: 'Courses API', href: '#courses-api' },
    { title: 'Videos API', href: '#videos-api' },
    { title: 'API Keys', href: '#api-keys' },
    { title: 'Server examples', href: '#server-examples' },
    { title: 'Response patterns', href: '#response-patterns' },
];

const courseMethods = [
    { name: 'sdk.courses.getAll({ query, category, limit })', description: 'Fetch public courses with optional filtering.' },
    { name: 'sdk.courses.search({ query, category, limit })', description: 'Search course titles, descriptions, and categories.' },
    { name: 'sdk.courses.getFeatured({ limit })', description: 'Return featured or highly rated courses.' },
    { name: 'sdk.courses.getCategories()', description: 'List available course categories.' },
    { name: 'sdk.courses.getById(courseId)', description: 'Read one course by ID.' },
    { name: 'sdk.courses.getChapters(courseId)', description: 'Return all chapters for a course.' },
    { name: 'sdk.courses.getChapter(courseId, chapterIndex)', description: 'Return one chapter by zero-based index.' },
    { name: 'sdk.courses.getLessons(courseId, chapterIndex)', description: 'Return lessons inside one chapter.' },
    { name: 'sdk.courses.getQuiz(courseId)', description: 'Return quiz questions for a course.' },
    { name: 'sdk.courses.getFlashcards(courseId)', description: 'Return flashcards for practice mode.' },
    { name: 'sdk.courses.getQA(courseId)', description: 'Return question-and-answer practice content.' },
];

const videoMethods = [
    { name: 'sdk.videos.getAll({ query, category, limit })', description: 'Fetch uploaded and YouTube-backed videos.' },
    { name: 'sdk.videos.getById(videoId)', description: 'Read one video by ID.' },
    { name: 'sdk.videos.search({ query, category, limit })', description: 'Search videos by title, description, or category.' },
    { name: 'sdk.videos.getByCategory(category)', description: 'Return videos for one category.' },
];

const keyMethods = [
    { name: 'sdk.keys.create({ name })', description: 'Create a developer API key using a user auth token.' },
    { name: 'sdk.keys.list()', description: 'List keys for the authenticated developer.' },
    { name: 'sdk.keys.revoke(keyId)', description: 'Revoke a key by ID.' },
];

const MakingRequests = () => {
    return (
        <DocPage
            title="Making Requests"
            description="Use the SDK from server-side JavaScript or TypeScript to fetch learning content and manage developer keys."
            eyebrow="API Reference"
            toc={toc}
        >
            <DocSection id="create-the-client" title="Create the client">
                <p>
                    Create one SDK instance and reuse it. The default API base
                    URL points to <code>https://api.chefuinc.com/api</code>.
                </p>
                <CodeHighlighter
                    filename="server.ts"
                    code={`import CheFuAcademy from 'chefu-academy-sdk';

const sdk = new CheFuAcademy({
  apiKey: process.env.CHEFU_API_KEY,
  timeout: 10000,
});`}
                />
            </DocSection>

            <DocSection id="courses-api" title="Courses API">
                <p>
                    Course methods return structured course data including
                    chapters, lessons, quiz content, flashcards, and Q&A where
                    available.
                </p>
                <MethodList items={courseMethods} />
                <CodeHighlighter
                    filename="courses.ts"
                    code={`const courses = await sdk.courses.search({
  query: 'machine learning',
  category: 'Technology',
  limit: 10,
});

const course = await sdk.courses.getById(courses.courses[0].id);
const lessons = await sdk.courses.getLessons(course.id, 0);
const quiz = await sdk.courses.getQuiz(course.id);`}
                />
            </DocSection>

            <DocSection id="videos-api" title="Videos API">
                <p>
                    Video methods include uploaded platform videos and videos
                    stored with YouTube metadata. YouTube-backed videos include
                    the video ID needed to load the real YouTube player.
                </p>
                <MethodList items={videoMethods} />
                <CodeHighlighter
                    filename="videos.ts"
                    code={`const videos = await sdk.videos.search({
  query: 'microchips',
  category: 'Technology & Gadgets',
  limit: 8,
});

const video = await sdk.videos.getById(videos.videos[0].id);
const related = await sdk.videos.getByCategory(video.category ?? 'Technology');`}
                />
            </DocSection>

            <DocSection id="api-keys" title="API Keys">
                <p>
                    Key management methods require a user auth token. For most
                    developers, the CLI is the easiest and safest way to create,
                    list, and revoke keys.
                </p>
                <MethodList items={keyMethods} />
                <CodeHighlighter
                    language="bash"
                    showLineNumbers={false}
                    filename="Terminal"
                    code={`npx chefu-academy login
npx chefu-academy keys create --name "Production"
npx chefu-academy keys list
npx chefu-academy keys revoke <key-id>`}
                />
                <DocCallout title="Raw keys are shown once" tone="amber">
                    Save the full <code>chf_</code> key immediately after
                    creation. Later list responses show metadata, not the secret.
                </DocCallout>
            </DocSection>

            <DocSection id="server-examples" title="Server examples">
                <p>
                    In a Next.js App Router project, keep the SDK in a Server
                    Component, route handler, server action, or backend service.
                </p>
                <CodeHighlighter
                    filename="app/api/academy/courses/route.ts"
                    code={`import CheFuAcademy from 'chefu-academy-sdk';
import { NextResponse } from 'next/server';

const sdk = new CheFuAcademy({
  apiKey: process.env.CHEFU_API_KEY,
});

export async function GET() {
  const courses = await sdk.courses.getFeatured({ limit: 6 });
  return NextResponse.json(courses);
}`}
                />
            </DocSection>

            <DocSection id="response-patterns" title="Response patterns">
                <p>List methods return an object with the collection and a total.</p>
                <CodeHighlighter
                    filename="List response"
                    code={`{
  courses: Course[],
  total: number
}

{
  videos: Video[],
  total: number
}`}
                />
                <p>
                    Single-resource methods return the requested resource or
                    throw a <code>CheFuAcademyError</code> when the request fails.
                </p>
            </DocSection>
        </DocPage>
    );
};

export default MakingRequests;
