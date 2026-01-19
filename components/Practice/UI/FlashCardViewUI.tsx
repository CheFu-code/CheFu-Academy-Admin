'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const FlashCardViewUI = () => {
    const router = useRouter();
    const flashcards = [
        {
            title: 'flash 1',
            id: '123',
        },
        {
            title: 'flash 2',
            id: '456',
        },
        {
            title: 'flash 3',
            id: '789',
        },
        {
            title: 'flash 3',
            id: '012',
        },
    ];
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
                {flashcards.map((item, i) => (
                    <Card
                        onClick={() =>
                            router.push(
                                `/courses/practice/flashcard/flashcard-view/${item.id}`,
                            )
                        }
                        className="cursor-pointer"
                        key={i}
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
                            <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FlashCardViewUI;
