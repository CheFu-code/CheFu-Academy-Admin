import type { Metadata } from 'next';
import CodeHighlighter from '../_components/CodeHighlighter';
import {
    DocCallout,
    DocPage,
    DocSection,
    MethodList,
} from '../_components/DocPage';
import LanguageExamplePicker from '../_components/LanguageExamplePicker';
import {
    courseRequestExamples,
    createClientExamples,
    keyManagementExamples,
    videoRequestExamples,
} from '../_components/languageExamples';

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
    {
        name: 'List courses',
        description: 'Fetch public courses with optional filtering.',
    },
    {
        name: 'Search courses',
        description: 'Search course titles, descriptions, and categories.',
    },
    {
        name: 'Featured courses',
        description: 'Return featured or highly rated courses.',
    },
    { name: 'Categories', description: 'List available course categories.' },
    { name: 'Course by ID', description: 'Read one course by ID.' },
    { name: 'Chapters', description: 'Return all chapters for a course.' },
    {
        name: 'Chapter by index',
        description: 'Return one chapter by zero-based index.',
    },
    { name: 'Lessons', description: 'Return lessons inside one chapter.' },
    { name: 'Quiz', description: 'Return quiz questions for a course.' },
    { name: 'Flashcards', description: 'Return flashcards for practice mode.' },
    {
        name: 'Q&A',
        description: 'Return question-and-answer practice content.',
    },
];

const videoMethods = [
    {
        name: 'List videos',
        description: 'Fetch uploaded and YouTube-backed videos.',
    },
    { name: 'Video by ID', description: 'Read one video by ID.' },
    {
        name: 'Search videos',
        description: 'Search videos by title, description, or category.',
    },
    { name: 'Category videos', description: 'Return videos for one category.' },
];

const keyMethods = [
    {
        name: 'Create key',
        description: 'Create a developer API key using a user auth token.',
    },
    {
        name: 'List keys',
        description: 'List keys for the authenticated developer.',
    },
    { name: 'Revoke key', description: 'Revoke a key by ID.' },
];

const MakingRequests = () => {
    return (
        <DocPage
            title="Making Requests"
            description="Use the official SDK clients to fetch learning content and manage developer keys from the language your app is already built in."
            eyebrow="API Reference"
            toc={toc}
        >
            <DocSection id="create-the-client" title="Create the client">
                <p>
                    Create one SDK instance and reuse it. The default API base
                    URL points to <code>https://api.chefuinc.com/api</code>.
                </p>
                <LanguageExamplePicker
                    title="Create the SDK client"
                    description="This preference follows you through all docs examples."
                    examples={createClientExamples}
                />
            </DocSection>

            <DocSection id="courses-api" title="Courses API">
                <p>
                    Course methods return structured course data including
                    chapters, lessons, quiz content, flashcards, and Q&A where
                    available.
                </p>
                <MethodList items={courseMethods} />
                <LanguageExamplePicker
                    title="Search courses and load practice content"
                    description="Use list/search first, then fetch chapters, lessons, quizzes, flashcards, or Q&A by course ID."
                    examples={courseRequestExamples}
                />
            </DocSection>

            <DocSection id="videos-api" title="Videos API">
                <p>
                    Video methods include uploaded platform videos and videos
                    stored with YouTube metadata. YouTube-backed videos include
                    the video ID needed to load the real YouTube player.
                </p>
                <MethodList items={videoMethods} />
                <LanguageExamplePicker
                    title="Search and load videos"
                    description="Video methods cover uploaded platform videos and YouTube-backed lessons."
                    examples={videoRequestExamples}
                />
            </DocSection>

            <DocSection id="api-keys" title="API Keys">
                <p>
                    Key management methods require a user auth token. For most
                    developers, the CLI is the easiest and safest way to create,
                    list, and revoke keys.
                </p>
                <MethodList items={keyMethods} />
                <LanguageExamplePicker
                    title="Create, list, and revoke keys"
                    description="Key management requires a user auth token from login."
                    examples={keyManagementExamples}
                />
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
                    creation. Later list responses show metadata, not the
                    secret.
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
                <p>
                    List methods return an object with the collection and a
                    total.
                </p>
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
                    raise the SDK error type for the selected language when the
                    request fails.
                </p>
            </DocSection>
        </DocPage>
    );
};

export default MakingRequests;
