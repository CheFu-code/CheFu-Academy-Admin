'use client';

import { usePracticeCourses } from '@/hooks/usePracticeCourses';
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
                    <p className="text-sm text-muted-foreground">
                        No flashcards found in your courses yet.
                    </p>
                )}
                {loading && (
                    <p className="text-sm text-muted-foreground">
                        Loading flashcards...
                    </p>
                )}
            </div>
        </div>
    );
};

export default FlashCardViewUI;
