import Header from '@/components/Shared/Header';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import React from 'react';

const PracticeUI = ({
    router,
}: {
    router: ReturnType<typeof import('next/navigation').useRouter>;
}) => {
    return (
        <>
            <Header
                header="Practice"
                description="Strengthen your skills with Quizzes, Flashcards, and Question & Answer."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
                <Card
                    className="cursor-pointer"
                    onClick={() => router.push('/courses/practice/quiz')}
                >
                    <CardHeader>
                        <CardTitle>Quiz</CardTitle>
                        <CardDescription>
                            Test your knowledge and see how much you&apos;ve
                            learned. Quizzes help reinforce concepts and track
                            your progress.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card
                    onClick={() => router.push('/courses/practice/flashcard')}
                    className="cursor-pointer"
                >
                    <CardHeader>
                        <CardTitle>Flashcard</CardTitle>
                        <CardDescription>
                            Review key concepts quickly with Flashcards ― a fast
                            and effective way to memorize important topics.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card
                   onClick={() => router.push('/courses/practice/questionAns')}
                    className="cursor-pointer"
                >
                    <CardHeader>
                        <CardTitle>Question & Answer</CardTitle>
                        <CardDescription>
                            Ask question or check answers to deepen your
                            understanding. Clarify doubts and learn from
                            explanations.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </>
    );
};

export default PracticeUI;
