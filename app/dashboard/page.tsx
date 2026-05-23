import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getServerSessionMeta } from '@/lib/server-session';
import { fetchCoursesServer } from '@/services/serverCourseService';
import { fetchPublicVideosServer } from '@/services/serverVideoService';
import {
    BookOpen,
    Brain,
    CirclePlay,
    Clock3,
    GraduationCap,
    Layers3,
    Plus,
    Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Dashboard | CheFu Academy',
    description: 'Continue learning, practice, and explore CheFu Academy content.',
};

export default async function DashboardPage() {
    const [session, courses, videos] = await Promise.all([
        getServerSessionMeta(),
        fetchCoursesServer(6),
        fetchPublicVideosServer(),
    ]);
    const featuredCourses = courses.slice(0, 3);
    const featuredVideos = videos.slice(0, 3);
    const firstName =
        session?.email?.split('@')[0]?.replace(/[._-]+/g, ' ') || 'learner';

    return (
        <main className="flex flex-col gap-6">
            <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-sm font-medium text-primary">
                                Learning dashboard
                            </p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                                Welcome back, {firstName}
                            </h1>
                            <p className="mt-3 text-muted-foreground">
                                Pick up where you left off, create a new course,
                                or jump into focused practice.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href="/courses/create-course">
                                    <Plus className="size-4" />
                                    Create Course
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/courses">Browse Courses</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Sparkles className="size-4 text-primary" />
                            Next Best Step
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <p className="text-sm text-muted-foreground">
                            Build momentum with a short practice session or a
                            beginner-friendly video.
                        </p>
                        <Button variant="secondary" asChild>
                            <Link href="/courses/practice">Start Practice</Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={BookOpen}
                    label="Available courses"
                    value={courses.length}
                />
                <StatCard
                    icon={CirclePlay}
                    label="Public videos"
                    value={videos.length}
                />
                <StatCard
                    icon={Brain}
                    label="Practice modes"
                    value={3}
                />
                <StatCard
                    icon={Clock3}
                    label="Recommended today"
                    value={featuredCourses.length + featuredVideos.length}
                />
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <CardTitle>Continue With Courses</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/courses">View all</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-3">
                            {featuredCourses.map(course => (
                                <Link
                                    key={course.id}
                                    href={`/courses/course-view/${course.id}`}
                                    className="overflow-hidden rounded-lg border bg-background transition-colors hover:bg-muted/60"
                                >
                                    <div className="relative aspect-video">
                                        <Image
                                            src={course.banner_image}
                                            alt={course.courseTitle}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h2 className="line-clamp-1 text-sm font-semibold">
                                            {course.courseTitle}
                                        </h2>
                                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                            {course.description ||
                                                'Open the course and keep learning.'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Practice</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <QuickLink
                            href="/courses/practice/quiz"
                            icon={GraduationCap}
                            title="Quiz"
                            description="Test your recall."
                        />
                        <QuickLink
                            href="/courses/practice/flashcard"
                            icon={Layers3}
                            title="Flashcards"
                            description="Review concepts quickly."
                        />
                        <QuickLink
                            href="/courses/practice/questionAns"
                            icon={Brain}
                            title="Q&A"
                            description="Practice deeper answers."
                        />
                    </CardContent>
                </Card>
            </section>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <CardTitle>Recommended Videos</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/videos/beginner">View videos</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-3">
                        {featuredVideos.map(video => (
                            <Link
                                key={video.id || video.videoURL}
                                href={video.id ? `/videos/details/${video.id}` : video.videoURL}
                                className="rounded-lg border bg-background p-3 transition-colors hover:bg-muted/60"
                            >
                                <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                                    <Image
                                        src={video.thumbnailURL}
                                        alt={video.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h2 className="mt-3 line-clamp-1 text-sm font-semibold">
                                    {video.title}
                                </h2>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {video.level || 'All levels'}
                                </p>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
}) {
    return (
        <Card>
            <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickLink({
    href,
    icon: Icon,
    title,
    description,
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/60"
        >
            <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4" />
            </div>
            <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </Link>
    );
}
