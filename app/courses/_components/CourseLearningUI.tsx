import CodeHighlighter from '@/components/Shared/CodeHighlighter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import ExampleBlock from '@/helpers/exampleBlock';
import ExplainText from '@/helpers/expandText';
import { Chapter, ChapterContentItem } from '@/types/course';
import { formatParagraph } from '@/utils/formatParagraph';
import {
    ArrowLeft,
    ArrowRight,
    BookOpenCheck,
    CheckCircle2,
    Download,
    FileText,
    GraduationCap,
    Layers3,
    Loader2,
} from 'lucide-react';
import { RefObject } from 'react';
import ChapterAiTutor from './ChapterAiTutor';

const CourseLearningUI = ({
    courseTitle,
    loading,
    scrollRef,
    progressPercent,
    totalContents,
    contentIndex,
    chapter,
    content,
    cleanCode,
    handleFinish,
    handlePrevious,
    handleNext,
    handleDownloadChapter,
}: {
    courseTitle: string;
    loading: boolean;
    scrollRef: RefObject<HTMLDivElement | null>;
    progressPercent: number;
    totalContents: number;
    contentIndex: number;
    chapter: Chapter;
    content: ChapterContentItem;
    cleanCode: string;
    handleFinish: () => void;
    handlePrevious: () => void;
    handleNext: () => void;
    handleDownloadChapter: () => void;
}) => {
    const progressValue = Math.min(
        100,
        Math.max(0, Math.round(progressPercent * 100)),
    );
    const isLastLesson = contentIndex + 1 === totalContents;
    const lessonLabel = `Lesson ${contentIndex + 1} of ${totalContents}`;

    return (
        <div
            ref={scrollRef}
            className="flex min-h-[calc(100svh-7rem)] w-full flex-col gap-5"
        >
            <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="bg-[linear-gradient(135deg,rgba(6,182,212,0.12),rgba(16,185,129,0.08),transparent)] p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-3">
                            <Badge
                                variant="outline"
                                className="w-fit border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200"
                            >
                                <GraduationCap className="h-3.5 w-3.5" />
                                Course learning
                            </Badge>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {courseTitle}
                                </p>
                                <h1 className="text-2xl font-bold leading-tight sm:text-4xl">
                                    {chapter.chapterName}
                                </h1>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="rounded-md">
                                <BookOpenCheck className="h-3.5 w-3.5" />
                                {lessonLabel}
                            </Badge>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleDownloadChapter}
                                        className="cursor-pointer"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Download Chapter
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                Chapter progress
                            </span>
                            <span className="font-medium">
                                {progressValue}%
                            </span>
                        </div>
                        <Progress value={progressValue} className="h-2" />
                    </div>
                </div>
            </section>

            <section className="flex flex-1">
                <article className="min-w-0 w-full rounded-xl border bg-card p-5 shadow-sm sm:p-6">
                    <div className="space-y-6">
                        {content.topic && (
                            <header className="border-b pb-5">
                                <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Current topic
                                </p>
                                <h2 className="mt-2 text-xl font-semibold leading-8">
                                    {formatParagraph(content.topic)}
                                </h2>
                            </header>
                        )}

                        {content.explain && (
                            <section className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <BookOpenCheck className="h-4 w-4 text-cyan-500" />
                                    Lesson explanation
                                </div>
                                <div className="text-base leading-8">
                                    <ExplainText text={content.explain} />
                                </div>
                            </section>
                        )}

                        {cleanCode && (
                            <section className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <Layers3 className="h-4 w-4 text-emerald-500" />
                                    Code reference
                                </div>
                                <CodeHighlighter code={cleanCode} />
                            </section>
                        )}

                        {content.example && (
                            <ExampleBlock text={content.example} />
                        )}
                    </div>
                </article>
            </section>

            <ChapterAiTutor
                courseTitle={courseTitle}
                chapterTitle={chapter.chapterName}
                lessonIndex={contentIndex}
                totalLessons={totalContents}
                content={content}
                lessonKey={`${chapter.chapterName}-${contentIndex}`}
            />

            <div className="grid grid-cols-1 gap-3 rounded-xl border bg-card p-3 shadow-sm sm:grid-cols-2">
                <Button
                    variant="outline"
                    className="h-11 w-full cursor-pointer transition"
                    onClick={handlePrevious}
                    disabled={loading || contentIndex === 0}
                >
                    <span className="flex items-center gap-2">
                        <ArrowLeft size={16} /> Back
                    </span>
                </Button>
                <Button
                    className="h-11 w-full cursor-pointer bg-cyan-600 transition hover:bg-cyan-700"
                    onClick={isLastLesson ? handleFinish : handleNext}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </span>
                    ) : isLastLesson ? (
                        <span className="flex items-center gap-2">
                            Finish Chapter <CheckCircle2 className="h-4 w-4" />
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Next Lesson <ArrowRight size={16} />
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default CourseLearningUI;
