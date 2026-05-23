import { cn } from '@/lib/utils';
import { AddCourseProp } from '@/types/course';
import {
    BookOpenCheck,
    BrainCircuit,
    CheckCircle2,
    Layers3,
    Loader,
    Save,
    Sparkle,
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
        description: 'Packaging everything so you can open it as soon as it is ready.',
        Icon: Save,
    },
];

const CreateCourseUI = ({
    topics,
    userInput,
    setUserInput,
    generatingTopic,
    generateTopic,
    generatingCourse,
    onGenerateCourse,
    selectedTopics,
    setSelectedTopics,
    mainWrapperRef,
}: AddCourseProp) => {
    return (
        <main
            ref={mainWrapperRef}
            className="min-h-screen bg-background flex flex-col justify-between"
        >
            <div>
                <Header
                    header="Create new course"
                    description="What do you want to learn today?"
                />
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Create new course</CardTitle>
                        <CardDescription>
                            What course do you want to create? (eg: Learn
                            JavaScript)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Topic</p>
                        <Input
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Learn how to bake bread..."
                            disabled={generatingCourse}
                        />
                        {userInput?.trim() && (
                            <Button
                                disabled={generatingTopic || generatingCourse}
                                onClick={generateTopic}
                                className={cn(
                                    'w-full mt-8 cursor-pointer',
                                    generatingTopic || generatingCourse
                                        ? 'cursor-not-allowed'
                                        : '',
                                )}
                            >
                                {generatingTopic
                                    ? 'Generating Topic...'
                                    : 'Generate Topic'}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {topics.length > 0 && (
                    <>
                        <div className="flex items-center justify-between mt-10">
                            <p className="font-semibold">
                                Select all topics which you want to add in this
                                course:
                            </p>
                            <Button
                                className="cursor-pointer"
                                variant="outline"
                                onClick={() => {
                                    if (generatingCourse) return;
                                    if (selectedTopics.length === topics.length) {
                                        setSelectedTopics([]);
                                    } else {
                                        setSelectedTopics(topics);
                                    }
                                }}
                                size="sm"
                                disabled={generatingCourse}>
                                {selectedTopics.length === topics.length
                                    ? 'Deselect all'
                                    : 'Select all'}
                            </Button>
                        </div>

                        <div className="mt-5 flex flex-row flex-wrap gap-2">
                            {topics.map((topic, index) => {
                                const isSelected =
                                    selectedTopics.includes(topic);

                                return (
                                    <button
                                        disabled={generatingCourse}
                                        key={index}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedTopics((prev) =>
                                                    prev.filter(
                                                        (t) => t !== topic,
                                                    ),
                                                );
                                            } else {
                                                setSelectedTopics((prev) => [
                                                    ...prev,
                                                    topic,
                                                ]);
                                                if (mainWrapperRef.current) {
                                                    mainWrapperRef.current?.scrollIntoView(
                                                        {
                                                            behavior: 'smooth',
                                                            block: 'end',
                                                        },
                                                    );
                                                }
                                            }
                                        }}
                                        className={cn(
                                            'border border-cyan-500 rounded-lg p-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70',
                                            isSelected
                                                ? 'bg-blue-950 text-white'
                                                : '',
                                        )}
                                    >
                                        <p className="text-sm">{topic}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Sticky Generate Course button at the bottom */}
            <div className="p-4 bg-background shadow-inner">
                <Button
                    className={cn(
                        'w-full cursor-pointer',
                        generatingCourse ? 'cursor-not-allowed' : '',
                    )}
                    disabled={selectedTopics.length === 0 || generatingCourse}
                    onClick={onGenerateCourse}
                >
                    {generatingCourse
                        ? 'Generating Course...'
                        : 'Generate Course'}
                    {generatingCourse ? (
                        <Loader className="animate-spin" />
                    ) : (
                        <Sparkle />
                    )}
                </Button>
            </div>

            {generatingCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md">
                    <Card
                        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto border-cyan-500/30 bg-background shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-live="polite"
                        aria-labelledby="course-generation-title"
                        aria-describedby="course-generation-description"
                    >
                        <div className="h-1 w-full overflow-hidden bg-cyan-500/15">
                            <div className="h-full w-1/2 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-cyan-400" />
                        </div>
                        <CardHeader>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-500">
                                    <Loader className="size-5 animate-spin" />
                                </div>
                                <div>
                                    <CardTitle id="course-generation-title">
                                        Your course is being generated
                                    </CardTitle>
                                    <CardDescription id="course-generation-description">
                                        We are creating a full course from{' '}
                                        {selectedTopics.length} selected{' '}
                                        {selectedTopics.length === 1
                                            ? 'topic'
                                            : 'topics'}
                                        . Keep this tab open and we will take you
                                        straight to the course.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                {generationSteps.map(
                                    ({ title, description, Icon }, index) => (
                                        <div
                                            key={title}
                                            className="flex min-h-24 gap-3 rounded-lg border bg-muted/30 p-3"
                                        >
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-cyan-500">
                                                {index === 0 ? (
                                                    <Loader className="size-4 animate-spin" />
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
                                    ),
                                )}
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="size-4 shrink-0 text-cyan-500" />
                                We are saving everything automatically. This
                                window will close when your course is ready.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </main>
    );
};

export default CreateCourseUI;
