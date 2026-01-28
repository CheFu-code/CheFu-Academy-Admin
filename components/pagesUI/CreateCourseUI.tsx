import { cn } from '@/lib/utils';
import { AddCourseProp } from '@/types/course';
import { Loader, Sparkle } from 'lucide-react';
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
}: AddCourseProp) => {
    return (
        <main className="min-h-screen bg-background flex flex-col justify-between">
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
                        />
                        {userInput?.trim() && (
                            <Button
                                disabled={generatingTopic}
                                onClick={generateTopic}
                                className={cn(
                                    'w-full mt-8 cursor-pointer',
                                    generatingTopic ? 'cursor-not-allowed' : '',
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
                        <p className="mt-10 font-semibold">
                            Select all topics which you want to add in this
                            course:
                        </p>

                        <div className="mt-5 flex flex-row flex-wrap gap-2">
                            {topics.map((topic, index) => {
                                const isSelected =
                                    selectedTopics.includes(topic);

                                return (
                                    <button
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
                                            }
                                        }}
                                        className={cn(
                                            'border border-cyan-500 rounded-lg p-1.5 cursor-pointer',
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
        </main>
    );
};

export default CreateCourseUI;
