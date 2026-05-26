import CodeHighlighter from '@/app/docs/_components/CodeHighlighter';
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
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
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
    return (
        <div
            ref={scrollRef}
            className="min-h-screen flex flex-col p-4 max-w-3xl mx-auto space-y-6"
        >
            {/* Header and save button */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                    {chapter.chapterName}
                </h1>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={handleDownloadChapter}
                            className="p-2 cursor-pointer rounded-xl hover:bg-gray-200/30"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>Download Chapter</TooltipContent>
                </Tooltip>
            </div>

            {/* Progress */}
            <Progress value={progressPercent * 100} />
            <p className="text-sm text-muted-foreground mt-1">
                Lesson {contentIndex + 1} of {totalContents}
            </p>

            {/* Scrollable main content */}
            <div className="flex-1 space-y-4 overflow-y-auto">
                {content.topic && (
                    <h2 className="text-lg font-semibold">
                        {formatParagraph(content.topic)}
                    </h2>
                )}
                {content.explain && <ExplainText text={content.explain} />}
                {cleanCode && <CodeHighlighter code={cleanCode} />}
                {content.example && <ExampleBlock text={content.example} />}
            </div>

            <ChapterAiTutor
                courseTitle={courseTitle}
                chapterTitle={chapter.chapterName}
                lessonIndex={contentIndex}
                totalLessons={totalContents}
                content={content}
                lessonKey={`${chapter.chapterName}-${contentIndex}`}
            />

            {/* Previous / Next / Finish buttons */}
            <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                    variant="outline"
                    className="cursor-pointer transition w-full"
                    onClick={handlePrevious}
                    disabled={loading || contentIndex === 0}
                >
                    <span className="flex items-center gap-2">
                        <ArrowLeft size={16} /> Back
                    </span>
                </Button>
                <Button
                    className="hover:bg-blue-700 cursor-pointer transition w-full"
                    onClick={
                        contentIndex + 1 === totalContents
                            ? handleFinish
                            : handleNext
                    }
                    disabled={loading}
                >
                    {loading ? (
                        'Loading...'
                    ) : contentIndex + 1 === totalContents ? (
                        'Finish'
                    ) : (
                        <span className="flex items-center gap-2">
                            Next <ArrowRight size={16} />
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default CourseLearningUI;
