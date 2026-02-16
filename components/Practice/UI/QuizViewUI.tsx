'use client';

import { usePracticeCourses } from '@/hooks/usePracticeCourses';
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
                    <p className="text-sm text-muted-foreground">
                        No quiz data found in your courses yet.
                    </p>
                )}
                {loading && (
                    <p className="text-sm text-muted-foreground">
                        Loading quizzes...
                    </p>
                )}
            </div>
        </div>
    );
};

export default QuizViewUI;
