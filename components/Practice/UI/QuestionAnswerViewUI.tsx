'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const QuestionAnswerViewUI = () => {
    const router = useRouter();
    const questionAns = [
        {
            title: 'question 1',
            id: '123',
        },
        {
            title: 'question 2',
            id: '456',
        },
        {
            title: 'question 3',
            id: '789',
        },
        {
            title: 'question 3',
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
                    alt="Quiz"
                    src={'/notes.png'}
                />
                <h1 className="absolute top-3 left-3 text-white text-xl font-semibold">
                    Question & Answer
                </h1>
            </div>
            <div className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-4 mt-8 gap-4">
                {questionAns.map((item, i) => (
                    <Card
                        onClick={() =>
                            router.push(
                                `/courses/practice/questionAns/question-answer-view/${item.id}`,
                            )
                        }
                        className="cursor-pointer"
                        key={i}
                    >
                        <div className="items-center justify-center flex">
                            <Image
                                priority
                                alt="Quiz"
                                src={'/qa.png'}
                                className="h-25 w-25"
                                width={25}
                                height={25}
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

export default QuestionAnswerViewUI;
