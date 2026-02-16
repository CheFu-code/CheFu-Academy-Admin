'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePracticeCourses } from '@/hooks/usePracticeCourses';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Quiz = () => {
    const params = useParams();
    const router = useRouter();
    const { courses, loading } = usePracticeCourses();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const course = courses.find(item => item.id === id);
    const quizzes = course?.quiz || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        setCurrentIndex(0);
        setScore(0);
        setSelectedOption(null);
        setFinished(false);
    }, [id]);

    const renderStateCard = ({
        title,
        description,
        showLoadingPulse = false,
        showBackButton = false,
    }: {
        title: string;
        description: string;
        showLoadingPulse?: boolean;
        showBackButton?: boolean;
    }) => (
        <div className="mx-auto flex min-h-[55vh] w-full max-w-2xl items-center justify-center p-4">
            <Card className="w-full border-border/60 shadow-sm">
                <CardHeader className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg">
                        {showLoadingPulse ? '...' : '?'}
                    </div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">{description}</p>
                    {showLoadingPulse && (
                        <div className="mx-auto h-1.5 w-28 animate-pulse rounded-full bg-primary/25" />
                    )}
                    {showBackButton && (
                        <Button
                            variant="outline"
                            onClick={() => router.push('/courses/practice/quiz')}
                        >
                            Back to Quiz List
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    if (loading) {
        return renderStateCard({
            title: 'Loading Quiz',
            description: 'Please wait while we prepare your quiz.',
            showLoadingPulse: true,
        });
    }

    if (!course) {
        return renderStateCard({
            title: 'Course Not Found',
            description:
                'This quiz link is invalid for your account or no longer exists.',
            showBackButton: true,
        });
    }

    if (quizzes.length === 0) {
        return renderStateCard({
            title: 'No Quiz Available',
            description:
                'This course exists, but there are no quiz questions added yet.',
            showBackButton: true,
        });
    }

    const currentQuestion = quizzes[currentIndex];

    const onNext = () => {
        if (!selectedOption) return;

        const isCorrect = selectedOption === currentQuestion.correctAns;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        const isLastQuestion = currentIndex === quizzes.length - 1;
        if (isLastQuestion) {
            setFinished(true);
            return;
        }

        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
    };

    const restartQuiz = () => {
        setCurrentIndex(0);
        setScore(0);
        setSelectedOption(null);
        setFinished(false);
    };

    if (finished) {
        return (
            <div className="space-y-4">
                <h1 className="text-xl font-semibold">{course.courseTitle} Quiz</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Complete</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-base">
                            You got <span className="font-semibold">{score}</span> out of{' '}
                            <span className="font-semibold">{quizzes.length}</span>.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Button onClick={restartQuiz}>Try Again</Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/courses/practice/quiz')}
                            >
                                Back to Quiz List
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">{course.courseTitle} Quiz</h1>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Question {currentIndex + 1} of {quizzes.length}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>{currentQuestion.question}</p>
                    <div className="space-y-2">
                        {currentQuestion.options?.map((option, optionIndex) => {
                            const isSelected = selectedOption === option;
                            return (
                                <button
                                    key={`${option}-${optionIndex}`}
                                    type="button"
                                    onClick={() => setSelectedOption(option)}
                                    className={`w-full rounded-md border px-3 py-2 text-left transition ${
                                        isSelected
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:bg-muted/50'
                                    }`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    <Button onClick={onNext} disabled={!selectedOption}>
                        {currentIndex === quizzes.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Quiz;
