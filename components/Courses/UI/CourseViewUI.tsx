import { downloadCoursePDF_Office } from '@/helpers/downloadCourse';
import {
    getCompletedChapterSet,
    getNextRequiredChapterIndex,
    isCourseFullyCompleted,
} from '@/lib/courseProgress';
import { Course } from '@/types/course';
import { formatParagraph } from '@/utils/formatParagraph';
import CourseReviewPanel from '../CourseReviewPanel';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    Download,
    Heart,
    Layers3,
    LockKeyhole,
    PartyPopper,
    PlayCircle,
    Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const CourseViewUI = ({
    course,
    completedChapters,
    totalChapters,
    progress,
    handleChapterClick,
    completedChaptersState,
    isFavorite,
    favoritePending,
    toggleFavorite,
    router,
}: {
    course: Course;
    completedChapters: number;
    totalChapters: number;
    progress: number;
    handleChapterClick: (idx: number) => Promise<void>;
    completedChaptersState: string[];
    isFavorite: boolean;
    favoritePending: boolean;
    toggleFavorite: () => Promise<void>;
    router: ReturnType<typeof import('next/navigation').useRouter>;
}) => {
    const completedChapterSet = getCompletedChapterSet(completedChaptersState);
    const nextChapterIndex = getNextRequiredChapterIndex(
        totalChapters,
        completedChaptersState,
    );
    const nextChapter =
        nextChapterIndex >= 0 ? course.chapters[nextChapterIndex] : undefined;
    const completed = isCourseFullyCompleted(
        totalChapters,
        completedChaptersState,
    );

    const goToSearch = (category: string) => {
        router.push(`/courses/search?query=${encodeURIComponent(category)}`);
    };

    return (
        <main className="mx-auto flex max-w-6xl flex-col gap-6 p-4">
            <section className="relative overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="relative min-h-[420px]">
                    <Image
                        fill
                        priority
                        src={course.banner_image}
                        alt={course.courseTitle}
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
                        <div className="max-w-3xl space-y-5 text-white">
                            <div className="flex flex-wrap items-center gap-2">
                                {completed && (
                                    <Badge className="bg-yellow-500 text-black">
                                        <PartyPopper className="mr-1 h-3.5 w-3.5" />
                                        Course completed
                                    </Badge>
                                )}
                                {course.category && (
                                    <Badge
                                        onClick={() => goToSearch(course.category)}
                                        className="cursor-pointer bg-white/15 text-white backdrop-blur hover:bg-cyan-600"
                                    >
                                        {course.category}
                                    </Badge>
                                )}
                                <Badge className="bg-cyan-500 text-white">
                                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                                    AI Course
                                </Badge>
                            </div>

                            <div>
                                <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">
                                    {course.courseTitle}
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                                    {course.description || 'Continue your structured learning path.'}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Button
                                    size="lg"
                                    onClick={() => handleChapterClick(nextChapterIndex)}
                                    disabled={nextChapterIndex < 0}
                                >
                                    <PlayCircle className="h-4 w-4" />
                                    {completed ? 'Review Course' : 'Continue Learning'}
                                </Button>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="lg"
                                            variant="secondary"
                                            onClick={() => downloadCoursePDF_Office(course)}
                                        >
                                            <Download className="h-4 w-4" />
                                            Download Course
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Download Course</TooltipContent>
                                </Tooltip>
                                <Button
                                    size="lg"
                                    variant={isFavorite ? 'default' : 'secondary'}
                                    onClick={toggleFavorite}
                                    disabled={favoritePending}
                                    aria-pressed={isFavorite}
                                >
                                    <Heart
                                        className={`h-4 w-4 ${
                                            isFavorite ? 'fill-current' : ''
                                        }`}
                                    />
                                    {isFavorite
                                        ? 'In Favourites'
                                        : 'Add to Favourites'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <MetricCard
                    icon={Layers3}
                    label="Chapters"
                    value={totalChapters}
                />
                <MetricCard
                    icon={CheckCircle2}
                    label="Completed"
                    value={completedChapters}
                />
                <MetricCard
                    icon={Clock3}
                    label="Progress"
                    value={`${Math.round(progress)}%`}
                />
            </section>

            {completed && (
                <section className="overflow-hidden rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-black">
                                <PartyPopper className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                    Course complete
                                </p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight">
                                    You finished {course.courseTitle}
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                                    Great work. You can review any chapter, download the
                                    course, or jump into practice to lock in what you learned.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => router.push('/courses/practice')}
                            >
                                Start Practice
                            </Button>
                            <Button onClick={() => handleChapterClick(0)}>
                                Review From Start
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            <CourseReviewPanel course={course} completed={completed} />

            <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <CardTitle>Learning Progress</CardTitle>
                            <span className="text-sm text-muted-foreground">
                                {completedChapters}/{totalChapters} chapters completed
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Progress value={progress} className="h-2 rounded-full" />
                        <p className="text-sm text-muted-foreground">
                            {completed
                                ? 'Nice work. You can revisit any chapter whenever you want.'
                                : nextChapter
                                    ? `Next up: ${nextChapter.chapterName}`
                                    : 'Start the first chapter when you are ready.'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-cyan-500/30 bg-cyan-500/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <BookOpen className="h-4 w-4 text-cyan-500" />
                            Course Plan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>{totalChapters} guided chapters</p>
                        <p>{course.quiz?.length || 0} quiz questions</p>
                        <p>{course.flashcards?.length || 0} flashcards</p>
                        <p>{course.qa?.length || 0} Q&A prompts</p>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-primary">Course roadmap</p>
                        <h2 className="text-2xl font-bold tracking-tight">Chapters</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Open the next required chapter to keep your progress in order.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {course.chapters.map((chapter, idx) => {
                        const isCompleted = completedChapterSet.has(idx.toString());
                        const isNext = !completed && idx === nextChapterIndex;
                        const isLocked = !completed && !isNext;
                        const preview = chapter.content[0]?.explain || chapter.content[0]?.topic || '';

                        return (
                            <button
                                key={chapter.chapterName || idx}
                                type="button"
                                disabled={isLocked}
                                onClick={() => handleChapterClick(idx)}
                                className={`group flex h-full min-h-52 flex-col rounded-xl border bg-card p-4 text-left shadow-sm transition duration-200 ${
                                    isLocked
                                        ? 'cursor-not-allowed border-border/60 opacity-60'
                                        : 'hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-xl'
                                } ${
                                    isNext
                                        ? 'border-cyan-500/70 bg-cyan-500/5'
                                        : isCompleted
                                            ? 'border-green-500/70 bg-green-500/5'
                                            : isLocked
                                                ? 'border-border/60 bg-muted/30'
                                                : 'border-border/70'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div
                                        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                                            isLocked
                                                ? 'bg-muted text-muted-foreground'
                                                : 'bg-muted'
                                        }`}
                                    >
                                        {idx + 1}
                                    </div>
                                    {isLocked ? (
                                        <Badge variant="secondary">
                                            <LockKeyhole className="mr-1 h-3.5 w-3.5" />
                                            Locked
                                        </Badge>
                                    ) : isNext && !isCompleted ? (
                                        <Badge className="bg-cyan-600 text-white">
                                            Next
                                        </Badge>
                                    ) : isCompleted ? (
                                        <Badge className="bg-green-600 text-white">
                                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                            Done
                                        </Badge>
                                    ) : null}
                                </div>

                                <div className="mt-4 flex-1">
                                    <h3 className="line-clamp-2 text-base font-semibold">
                                        {chapter.chapterName}
                                    </h3>
                                    {preview && (
                                        <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">
                                            {formatParagraph(preview)}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t pt-3">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {isLocked
                                            ? isCompleted
                                                ? 'Completed - continue with the next chapter'
                                                : 'Complete the next chapter first'
                                            : isCompleted
                                                ? 'Review chapter'
                                                : 'Open next chapter'}
                                    </span>
                                    <span
                                        className={`flex size-9 items-center justify-center rounded-full transition ${
                                            isLocked
                                                ? 'bg-muted text-muted-foreground'
                                                : 'bg-cyan-500 text-white group-hover:translate-x-1'
                                        }`}
                                    >
                                        {isLocked ? (
                                            <LockKeyhole className="h-4 w-4" />
                                        ) : (
                                            <ArrowRight className="h-4 w-4" />
                                        )}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>
        </main>
    );
};

function MetricCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number | string;
}) {
    return (
        <Card>
            <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-11 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default CourseViewUI;
