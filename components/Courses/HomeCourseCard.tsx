import { imageAssets } from '@/constants/Options';
import { downloadCoursePDF_Office } from '@/helpers/downloadCourse';
import { Course } from '@/types/course';
import {
    ArrowRight,
    BookOpenCheck,
    CalendarClock,
    Clock3,
    Download,
    PlayCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CardDescription, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

type TimestampLike = {
    seconds?: number;
    toDate?: () => Date;
};

const toDate = (value: unknown) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    const timestamp = value as TimestampLike;
    if (typeof timestamp.toDate === 'function') return timestamp.toDate();
    if (typeof timestamp.seconds === 'number') {
        return new Date(timestamp.seconds * 1000);
    }

    return null;
};

const formatDate = (value: unknown) => {
    const date = toDate(value);
    if (!date) return 'Not opened yet';

    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    });
};

const HomeCourseCard = ({
    id,
    banner_image,
    courseTitle,
    category,
    totalChapters,
    completedChapters,
    progress,
    lastStudiedAt,
    lastStudiedChapterIndex,
    lastStudiedContentIndex,
    lastStudiedChapterName,
    lastStudiedTopic,
    course,
}: {
    id: string;
    banner_image: string;
    courseTitle: string;
    category: string;
    totalChapters: number;
    completedChapters: number;
    progress: number;
    lastStudiedAt?: unknown;
    lastStudiedChapterIndex?: number;
    lastStudiedContentIndex?: number;
    lastStudiedChapterName?: string;
    lastStudiedTopic?: string;
    course?: Course;
}) => {
    const router = useRouter();
    const imageSrc = imageAssets[banner_image] || banner_image;
    const completed = totalChapters > 0 && completedChapters >= totalChapters;
    const remainingChapters = Math.max(totalChapters - completedChapters, 0);
    const resumeChapter = lastStudiedChapterIndex ?? 0;
    const resumeLesson = lastStudiedContentIndex ?? 0;
    const resumeHref = `/courses/my-courses/course-view/${id}/course-learning?chapter=${resumeChapter}&lesson=${resumeLesson}`;

    const goToSearch = (courseCategory: string) => {
        router.push(`/courses/search?query=${encodeURIComponent(courseCategory)}`);
    };

    return (
        <div
            key={id}
            onClick={() => router.push(`/courses/my-courses/course-view/${id}`)}
            className={`group cursor-pointer overflow-hidden rounded-xl border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl ${
                completed
                    ? 'border-green-500/70'
                    : 'border-border/70'
            }`}
        >
            {banner_image && (
                <div className="relative h-36 w-full overflow-hidden sm:h-40">
                    <Image
                        fill
                        priority
                        src={imageSrc}
                        alt={courseTitle}
                        className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    {category && (
                        <Badge
                            onClick={(event) => {
                                event.stopPropagation();
                                goToSearch(category);
                            }}
                            variant="secondary"
                            className="absolute left-3 top-3 cursor-pointer bg-background/90 text-foreground shadow-md backdrop-blur hover:bg-cyan-600 hover:text-white"
                        >
                            {category}
                        </Badge>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                        <CardTitle className="line-clamp-2 text-lg font-semibold text-white">
                            {courseTitle}
                        </CardTitle>
                    </div>
                </div>
            )}

            <div className="space-y-4 p-4">
                <div className="grid gap-2 text-sm text-muted-foreground">
                    <CardDescription className="flex items-center gap-2">
                        <BookOpenCheck className="h-4 w-4 text-cyan-500" />
                        {totalChapters} chapter{totalChapters !== 1 ? 's' : ''}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-cyan-500" />
                        Opened {formatDate(lastStudiedAt)}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-cyan-500" />
                        {completed
                            ? 'Ready to review'
                            : `${remainingChapters} chapter${
                                  remainingChapters !== 1 ? 's' : ''
                              } remaining`}
                    </CardDescription>
                </div>

                {(lastStudiedChapterName || lastStudiedTopic) && (
                    <div className="rounded-lg bg-muted/50 p-3">
                        <p className="line-clamp-1 text-xs font-medium text-foreground">
                            {lastStudiedChapterName || 'Resume course'}
                        </p>
                        {lastStudiedTopic && (
                            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                {lastStudiedTopic}
                            </p>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {completedChapters}/{totalChapters} completed
                        </span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5 rounded-full sm:h-2" />
                </div>

                <div className="flex items-center justify-between gap-2">
                    {completed ? (
                        <Badge className="bg-green-600 text-white">Completed</Badge>
                    ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                            Continue
                        </span>
                    )}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-9"
                            aria-label="Download course"
                            onClick={(event) => {
                                event.stopPropagation();
                                if (course) void downloadCoursePDF_Office(course);
                            }}
                            disabled={!course}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            className="size-9 rounded-full bg-cyan-500 text-white hover:bg-cyan-600"
                            aria-label="Continue course"
                            onClick={(event) => {
                                event.stopPropagation();
                                router.push(completed ? `/courses/my-courses/course-view/${id}` : resumeHref);
                            }}
                        >
                            {completed ? (
                                <ArrowRight className="h-4 w-4" />
                            ) : (
                                <PlayCircle className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeCourseCard;
