'use client';

import { usePracticeCourses } from '@/hooks/usePracticeCourses';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

const QuestionAnswerViewUI = () => {
    const router = useRouter();
    const { courses, loading } = usePracticeCourses();
    const questionAns = useMemo(
        () => courses.filter(course => (course.qa || []).length > 0),
        [courses],
    );

    return (
        <div className="space-y-6">
            <div className="relative flex h-72 overflow-hidden rounded-2xl">
                <Image
                    fill
                    priority
                    className="w-full object-cover"
                    alt="Question and Answer"
                    src={'/notes.png'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs text-white backdrop-blur">
                    Practice Mode
                </div>
                <h1 className="absolute bottom-4 left-4 text-2xl font-semibold text-white">
                    Question & Answer
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {!loading &&
                    questionAns.map(item => (
                        <Card
                            onClick={() =>
                                router.push(
                                    `/courses/practice/questionAns/question-answer-view/${item.id}`,
                                )
                            }
                            className="group cursor-pointer overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
                            key={item.id}
                        >
                            <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-emerald-500/20 to-teal-500/10">
                                <Image
                                    priority
                                    alt="Question and Answer"
                                    src={'/qa.png'}
                                    className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-105"
                                    width={80}
                                    height={80}
                                />
                            </div>
                            <CardHeader className="space-y-1.5">
                                <CardTitle className="line-clamp-2 text-base">{item.courseTitle}</CardTitle>
                                <CardDescription>
                                    {(item.qa || []).length} Q&A item(s)
                                </CardDescription>
                                <p className="pt-1 text-xs font-medium text-primary">
                                    Start reflection
                                </p>
                            </CardHeader>
                        </Card>
                    ))}
                {!loading && questionAns.length === 0 && (
                    <Card className="col-span-1 border-dashed sm:col-span-2 lg:col-span-3">
                        <CardHeader className="space-y-2 text-center">
                            <CardTitle>No Q&A Practice Yet</CardTitle>
                            <CardDescription>
                                Add Q&A content to one of your courses to start practice.
                            </CardDescription>
                            <div className="pt-1">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/courses/my-courses')}
                                >
                                    Open My Courses
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                )}
                {loading && (
                    <Card className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <CardHeader className="space-y-3 text-center">
                            <CardTitle>Loading Q&A Practice</CardTitle>
                            <CardDescription>
                                Pulling your Q&A sets from enrolled courses.
                            </CardDescription>
                            <div className="mx-auto h-1.5 w-28 animate-pulse rounded-full bg-primary/25" />
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default QuestionAnswerViewUI;
