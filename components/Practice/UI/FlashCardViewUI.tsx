'use client';

import { usePracticeCourses } from '@/hooks/usePracticeCourses';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

const FlashCardViewUI = () => {
    const router = useRouter();
    const { courses, loading } = usePracticeCourses();
    const flashcards = useMemo(
        () => courses.filter(course => (course.flashcards || []).length > 0),
        [courses],
    );

    return (
        <div>
            <div className="flex overflow-hidden relative z-0 h-80">
                <Image
                    fill
                    priority
                    className="w-full object-cover rounded-b-xl"
                    alt="Flashcard"
                    src={'/flashcard.png'}
                />
                <h1 className="absolute top-3 left-3 text-white text-xl font-semibold">
                    Flashcard
                </h1>
            </div>
            <div className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-4 mt-8 gap-4">
                {!loading &&
                    flashcards.map((item) => (
                    <Card
                        onClick={() =>
                            router.push(
                                `/courses/practice/flashcard/flashcard-view/${item.id}`,
                            )
                        }
                        className="cursor-pointer"
                        key={item.id}
                    >
                        <div className="items-center justify-center flex">
                            <Image
                                priority
                                alt="Flashcard"
                                src={'/layers.png'}
                                className="h-15 w-20 sm:h-20 sm:w-25 lg:h-20 lg:w-25"
                                width={20}
                                height={20}
                            />
                        </div>
                        <CardHeader>
                            <CardTitle>{item.courseTitle}</CardTitle>
                            <CardDescription>
                                {(item.flashcards || []).length} flashcard(s)
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
                {!loading && flashcards.length === 0 && (
                    <Card className="col-span-2 sm:col-span-3 lg:col-span-4 border-dashed">
                        <CardHeader className="text-center space-y-2">
                            <CardTitle>No Flashcard Practice Yet</CardTitle>
                            <CardDescription>
                                We couldn&apos;t find any courses with flashcards in your
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
                            <CardTitle>Loading Flashcard Practice</CardTitle>
                            <CardDescription>
                                Please wait while we fetch your available flashcard sets.
                            </CardDescription>
                            <div className="mx-auto h-1.5 w-28 animate-pulse rounded-full bg-primary/25" />
                        </CardHeader>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default FlashCardViewUI;
