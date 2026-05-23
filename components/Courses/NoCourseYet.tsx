'use client';

import { BookOpen, Compass, FileUp, Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ComponentType } from 'react';
import { Button } from '../ui/button';

const NoCourseYet = () => {
    const router = useRouter();

    return (
        <div className="flex min-h-[420px] w-full flex-col items-center justify-center rounded-xl border bg-card p-6 shadow-sm">
            <div className="max-w-2xl text-center">
                <span className="block text-3xl font-extrabold text-foreground sm:text-4xl">
                    My Courses
                </span>
                <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                    Start with a generated course, browse something proven, or
                    import your own material into a study path.
                </p>
            </div>

            <div className="mt-8 grid w-full max-w-3xl gap-3 md:grid-cols-3">
                <EmptyAction
                    icon={Plus}
                    title="Create from topic"
                    description="Generate a course around one skill or goal."
                    onClick={() => router.push('/courses/create-course')}
                />
                <EmptyAction
                    icon={Compass}
                    title="Browse recommended"
                    description="Explore popular paths and categories."
                    onClick={() => router.push('/courses/search')}
                />
                <EmptyAction
                    icon={FileUp}
                    title="Import material"
                    description="Turn your notes or files into lessons."
                    onClick={() => router.push('/courses/create-course')}
                />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
                <Button
                    onClick={() => router.push('/courses/create-course')}
                    className="cursor-pointer"
                >
                    <Sparkles className="size-4" />
                    Generate first course
                </Button>
                <Button
                    onClick={() => router.push('/courses')}
                    variant="outline"
                    className="cursor-pointer"
                >
                    <BookOpen className="size-4" />
                    Browse Courses
                </Button>
            </div>
        </div>
    );
};

function EmptyAction({
    icon: Icon,
    title,
    description,
    onClick,
}: {
    icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-lg border bg-background p-4 text-left transition-colors hover:bg-muted/60"
        >
            <Icon className="size-6 text-primary" />
            <p className="mt-3 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </button>
    );
}

export default NoCourseYet;
