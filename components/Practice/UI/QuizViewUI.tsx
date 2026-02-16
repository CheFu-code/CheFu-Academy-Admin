'use client';

import { usePracticeCourses } from '@/hooks/usePracticeCourses';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

const QuizViewUI = () => {
    const router = useRouter();
    const { courses, loading } = usePracticeCourses();
    const quizzes = useMemo(
        () => courses.filter(course => (course.quiz || []).length > 0),
        [courses],
    );

    return (
        <div>
            <div className="flex overflow-hidden relative z-0 h-80">
                <Image
                    fill
                    priority
                    className="w-full object-cover rounded-b-xl"
                    alt="Quiz"
                    src={'/quizz.png'}
                />
                <h1 className="absolute top-3 left-3 text-white text-xl font-semibold">
                    Quiz
                </h1>
            </div>
            <div className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-4 mt-8 gap-4">
                {!loading &&
                    quizzes.map((item) => (
                    <Card
                        onClick={() =>
                            router.push(
                                `/courses/practice/quiz/quiz-view/${item.id}`,
                            )
                        }
                        className="cursor-pointer"
                        key={item.id}
                    >
                        <div className="items-center justify-center flex">
                            <Image
                                priority
                                alt="Quiz"
                                src={'/quiz.png'}
                                className="h-25 w-25"
                                width={25}
                                height={25}
                            />
                        </div>
                        <CardHeader>
                            <CardTitle>{item.courseTitle}</CardTitle>
                            <CardDescription>
                                {(item.quiz || []).length} question(s)
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
                {!loading && quizzes.length === 0 && (
                    <Card className="col-span-2 sm:col-span-3 lg:col-span-4 border-dashed">
                        <CardHeader className="text-center space-y-2">
                            <CardTitle>No Quizzes Yet</CardTitle>
                            <CardDescription>
                                We couldn&apos;t find any courses with quiz content in your
                                account.
                            </CardDescription>
                            <div className="pt-2">
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
                    <Card className="col-span-2 sm:col-span-3 lg:col-span-4">
                        <CardHeader className="text-center space-y-3">
                            <CardTitle>Loading Quizzes...</CardTitle>
                            <CardDescription>
                                Please wait while we fetch your available quiz sets.
                            </CardDescription>
                            <div className="mx-auto h-1.5 w-28 animate-pulse rounded-full bg-primary/25" />
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default QuizViewUI;
