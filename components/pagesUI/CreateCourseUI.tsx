import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AddCourseProp } from '@/types/course';
import {
    ArrowLeft,
    BookOpenCheck,
    BrainCircuit,
    CheckCircle2,
    FileUp,
    Layers3,
    Loader2,
    Save,
    Sparkles,
    WandSparkles,
} from 'lucide-react';
import Header from '../Shared/Header';
import { Button } from '../ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';

const generationSteps = [
    {
        title: 'Planning the course path',
        description: 'Turning your selected topics into a clear learning route.',
        Icon: BrainCircuit,
    },
    {
        title: 'Building chapters',
        description: 'Creating lessons, explanations, examples, and structure.',
        Icon: Layers3,
    },
    {
        title: 'Preparing practice material',
        description: 'Adding quizzes, flashcards, and Q&A for active recall.',
        Icon: BookOpenCheck,
    },
    {
        title: 'Saving your course',
        description: 'Packaging everything so you can open it when it is ready.',
        Icon: Save,
    },
];

const CreateCourseUI = ({
    topics,
    setTopics,
    userInput,
    setUserInput,
    generatingTopic,
    generateTopic,
    onImportLearningFile,
    generatingCourse,
    onGenerateCourse,
    selectedTopics,
    setSelectedTopics,
    mainWrapperRef,
    courseGenerationProgress,
    courseGenerationStatus,
    courseGenerationStepIndex,
}: AddCourseProp) => {
    const activeStep = generatingCourse ? 2 : topics.length > 0 ? 1 : 0;
    const progressValue = Math.min(
        Math.max(courseGenerationProgress, generatingCourse ? 3 : 0),
        100,
    );
    const allSelected = topics.length > 0 && selectedTopics.length === topics.length;

    const toggleTopic = (topic: string) => {
        if (generatingCourse) return;

        setSelectedTopics((prev) =>
            prev.includes(topic)
                ? prev.filter((selectedTopic) => selectedTopic !== topic)
                : [...prev, topic],
        );
    };

    const goBackToPrompt = () => {
        if (generatingCourse) return;
        setTopics([]);
        setSelectedTopics([]);
    };

    return (
        <main
            ref={mainWrapperRef}
            className="flex min-h-screen flex-col bg-background"
        >
            <Header
                header="Create new course"
                description="What do you want to learn today?"
            />

            <div className="mt-6 overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${activeStep * 100}%)` }}
                >
                    <section className="w-full shrink-0 px-1">
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <WandSparkles className="size-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Create new course</CardTitle>
                                        <CardDescription>
                                            Describe what you want to learn and
                                            CheFu will suggest focused topics for
                                            your course.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Topic</p>
                                    <Input
                                        value={userInput}
                                        onChange={(e) =>
                                            setUserInput(e.target.value)
                                        }
                                        placeholder="Learn how to bake bread..."
                                        disabled={
                                            generatingTopic || generatingCourse
                                        }
                                    />
                                </div>

                                <Button
                                    disabled={
                                        !userInput.trim() ||
                                        generatingTopic ||
                                        generatingCourse
                                    }
                                    onClick={generateTopic}
                                    className={cn(
                                        'w-full cursor-pointer',
                                        generatingTopic || generatingCourse
                                            ? 'cursor-not-allowed'
                                            : '',
                                    )}
                                >
                                    {generatingTopic ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Generating topics...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="size-4" />
                                            Generate Topics
                                        </>
                                    )}
                                </Button>

                                {onImportLearningFile && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onImportLearningFile}
                                        disabled={
                                            generatingCourse || generatingTopic
                                        }
                                        className="w-full"
                                    >
                                        <FileUp className="size-4" />
                                        Import PDF, Markdown, or Text
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    <section className="w-full shrink-0 px-1">
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <CardTitle>Choose your topics</CardTitle>
                                        <CardDescription>
                                            Select the topics you want included,
                                            then generate your course.
                                        </CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={goBackToPrompt}
                                        disabled={generatingCourse}
                                        className="w-fit"
                                    >
                                        <ArrowLeft className="size-4" />
                                        Back
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3">
                                    <div>
                                        <p className="text-sm font-medium">
                                            {selectedTopics.length} of{' '}
                                            {topics.length} selected
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Pick only what you want in this
                                            course.
                                        </p>
                                    </div>
                                    <Button
                                        className="cursor-pointer"
                                        variant="outline"
                                        onClick={() => {
                                            if (generatingCourse) return;
                                            setSelectedTopics(
                                                allSelected ? [] : topics,
                                            );
                                        }}
                                        size="sm"
                                        disabled={generatingCourse}
                                    >
                                        {allSelected
                                            ? 'Deselect all'
                                            : 'Select all'}
                                    </Button>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {topics.map((topic, index) => {
                                        const isSelected =
                                            selectedTopics.includes(topic);

                                        return (
                                            <button
                                                type="button"
                                                disabled={generatingCourse}
                                                key={`${topic}-${index}`}
                                                onClick={() => toggleTopic(topic)}
                                                className={cn(
                                                    'flex min-h-20 items-start gap-3 rounded-lg border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-70',
                                                    isSelected
                                                        ? 'border-primary bg-primary/10'
                                                        : 'bg-card hover:border-primary/50',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                                                        isSelected
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-muted-foreground/40',
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <CheckCircle2 className="size-3.5" />
                                                    )}
                                                </span>
                                                <span className="text-sm font-medium leading-5">
                                                    {topic}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <Button
                                    className={cn(
                                        'w-full cursor-pointer',
                                        generatingCourse
                                            ? 'cursor-not-allowed'
                                            : '',
                                    )}
                                    disabled={
                                        selectedTopics.length === 0 ||
                                        generatingCourse
                                    }
                                    onClick={onGenerateCourse}
                                >
                                    {generatingCourse ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Generating Course...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="size-4" />
                                            Generate Course
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="w-full shrink-0 px-1">
                        <Card
                            className="overflow-hidden border-cyan-500/30"
                            aria-live="polite"
                        >
                            <div className="h-1 bg-cyan-500/15">
                                <div
                                    className="h-full bg-cyan-500 transition-all duration-700"
                                    style={{ width: `${progressValue}%` }}
                                />
                            </div>
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-500">
                                        <Loader2 className="size-5 animate-spin" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle>
                                            Generating your course
                                        </CardTitle>
                                        <CardDescription>
                                            {courseGenerationStatus ||
                                                'Preparing your course...'}
                                        </CardDescription>
                                    </div>
                                    <span className="shrink-0 text-2xl font-bold tabular-nums">
                                        {Math.round(progressValue)}%
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <Progress
                                    value={progressValue}
                                    className="h-2 rounded-full"
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {generationSteps.map(
                                        ({ title, description, Icon }, index) => {
                                            const isDone =
                                                index <
                                                courseGenerationStepIndex;
                                            const isActive =
                                                index ===
                                                courseGenerationStepIndex;

                                            return (
                                                <div
                                                    key={title}
                                                    className={cn(
                                                        'flex min-h-24 gap-3 rounded-lg border p-3 transition',
                                                        isActive
                                                            ? 'border-cyan-500/50 bg-cyan-500/10'
                                                            : isDone
                                                                ? 'border-green-500/40 bg-green-500/10'
                                                                : 'bg-muted/30',
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            'flex size-9 shrink-0 items-center justify-center rounded-full bg-background',
                                                            isDone
                                                                ? 'text-green-600'
                                                                : 'text-cyan-500',
                                                        )}
                                                    >
                                                        {isDone ? (
                                                            <CheckCircle2 className="size-4" />
                                                        ) : isActive ? (
                                                            <Loader2 className="size-4 animate-spin" />
                                                        ) : (
                                                            <Icon className="size-4" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium leading-none">
                                                            {title}
                                                        </p>
                                                        <p className="mt-2 text-sm text-muted-foreground">
                                                            {description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>

                                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="size-4 shrink-0 text-cyan-500" />
                                    Keep this tab open. The course opens
                                    automatically when generation is complete.
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default CreateCourseUI;
