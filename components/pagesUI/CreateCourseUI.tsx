import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { PlusIcon, Sparkle } from 'lucide-react';
import { AddCourseProp } from '@/types/course';
import { cn } from '@/lib/utils';

const CreateCourseUI = ({
    topic,
    setTopic,
    selectedTopics,
    setSelectedTopics,
}: AddCourseProp) => {
    const topics = [
        {
            topic: 'Prepare ingredients',
        },
        {
            topic: 'Add flour',
        },
        {
            topic: 'Add flavors',
        },
        { topic: 'Put to oven' },
    ];
    return (
        <main className="min-h-screen bg-background">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Create new course</CardTitle>
                        <CardDescription>
                            What do you want to learn today?
                        </CardDescription>
                        <p className="text-muted-foreground text-sm text-center mt-5">
                            What course do you want to create? (eg: Learn
                            JavaScript)
                        </p>
                    </CardHeader>
                    <CardContent>
                        <p>Topic</p>
                        <Input
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Learn how to bake bread..."
                        />
                        {topic.trim() && (
                            <Button className="w-full mt-8 cursor-pointer">
                                Generate Topic <PlusIcon />
                            </Button>
                        )}
                    </CardContent>
                </Card>
                <p className="mt-10 font-semibold">
                    Select all topics which you want to add in this course:
                </p>
            </div>
            <div className="mt-5">
                {topics.map((item, index) => {
                    return (
                        <button
                            onClick={() => setSelectedTopics(item.topic)}
                            className={cn(
                                'border border-cyan-500 rounded-lg p-2 cursor-pointer mb-2 flex flex-col',
                                selectedTopics ? 'bg-blue-950' : '',
                            )}
                            key={index}
                        >
                            <p className="text-sm">{item.topic}</p>
                        </button>
                    );
                })}
            </div>

            {/* {selectedTopics.length < 0 && ( */}
            <div className=" mt-20">
                <Button className="w-full cursor-pointer">
                    Generate Course
                    <Sparkle />
                </Button>
            </div>
            {/* )} */}
        </main>
    );
};

export default CreateCourseUI;
