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
import { ArrowRight, Download } from 'lucide-react';
import { RefObject } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CourseLearningUI = ({
    loading,
    scrollRef,
    progressPercent,
    totalContents,
    contentIndex,
    chapter,
    content,
    cleanCode,
    detectedLanguage,
    handleFinish,
    handleNext,
    handleDownloadChapter,
}: {
    loading: boolean;
    scrollRef: RefObject<HTMLDivElement | null>;
    progressPercent: number;
    totalContents: number;
    contentIndex: number;
    chapter: Chapter;
    content: ChapterContentItem;
    cleanCode: string;
    detectedLanguage: string;
    handleFinish: () => void;
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
                <h1 className="text-3xl font-bold">{chapter.chapterName}</h1>
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
                    <h2 className="text-xl font-semibold">{content.topic}</h2>
                )}
                {content.explain && <ExplainText text={content.explain} />}
                {cleanCode && (
                    <SyntaxHighlighter
                        language={detectedLanguage}
                        style={vscDarkPlus}
                        showLineNumbers
                        wrapLongLines
                        customStyle={{
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            fontSize: '0.875rem',
                            fontFamily: 'Fira Code, monospace',
                            overflowX: 'auto',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }}
                    >
                        {cleanCode}
                    </SyntaxHighlighter>
                )}
                {content.example && <ExampleBlock text={content.example} />}
            </div>

            {/* Next / Finish button */}
            <div className="mt-auto">
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
