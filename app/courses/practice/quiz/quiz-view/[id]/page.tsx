'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePracticeCourses } from '@/hooks/usePracticeCourses';
import {
    ArrowLeft,
    CheckCircle2,
    RotateCcw,
    Sparkles,
    Trophy,
    XCircle,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

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
    const [confettiSize, setConfettiSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        setCurrentIndex(0);
        setScore(0);
        setSelectedOption(null);
        setFinished(false);
    }, [id]);

    useEffect(() => {
        const updateSize = () => {
            setConfettiSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateSize();
        window.addEventListener('resize', updateSize);

        return () => window.removeEventListener('resize', updateSize);
    }, []);

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
    const progressPercent = ((currentIndex + 1) / quizzes.length) * 100;

    const onNext = () => {
        if (!selectedOption) return;

        const isCorrect = selectedOption === currentQuestion.correctAns;
        const nextScore = score + (isCorrect ? 1 : 0);
        setScore(nextScore);

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
        const scorePercent = Math.round((score / quizzes.length) * 100);
        const passed = scorePercent >= 80;
        const missed = quizzes.length - score;

        return (
            <div className="relative mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center p-4">
                {passed && (
                    <Confetti
                        width={confettiSize.width}
                        height={confettiSize.height}
                        numberOfPieces={360}
                        recycle={false}
                        gravity={0.18}
                        className="pointer-events-none fixed inset-0 z-50"
                    />
                )}
                <Card className="w-full overflow-hidden border-border/60 shadow-xl">
                    <div
                        className={`h-2 ${
                            passed ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                    />
                    <CardHeader className="items-center space-y-4 text-center">
                        <div
                            className={`flex size-16 items-center justify-center rounded-full ${
                                passed
                                    ? 'bg-green-500/10 text-green-600'
                                    : 'bg-yellow-500/10 text-yellow-600'
                            }`}
                        >
                            {passed ? (
                                <Trophy className="h-8 w-8" />
                            ) : (
                                <Sparkles className="h-8 w-8" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Badge
                                className={
                                    passed
                                        ? 'bg-green-600 text-white'
                                        : 'bg-yellow-500 text-black'
                                }
                            >
                                {passed ? 'Excellent score' : 'Keep practicing'}
                            </Badge>
                            <CardTitle className="text-2xl">
                                {course.courseTitle} Quiz Complete
                            </CardTitle>
                            <p className="mx-auto max-w-xl text-sm text-muted-foreground">
                                {passed
                                    ? 'Great work. You scored high enough to show strong recall.'
                                    : 'You finished the quiz. Review the course and try again to build confidence.'}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-lg border bg-muted/30 p-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Score
                                </p>
                                <p className="mt-1 text-3xl font-bold">
                                    {scorePercent}%
                                </p>
                            </div>
                            <div className="rounded-lg border bg-muted/30 p-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Correct
                                </p>
                                <p className="mt-1 flex items-center justify-center gap-2 text-3xl font-bold text-green-600">
                                    <CheckCircle2 className="h-6 w-6" />
                                    {score}
                                </p>
                            </div>
                            <div className="rounded-lg border bg-muted/30 p-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Missed
                                </p>
                                <p className="mt-1 flex items-center justify-center gap-2 text-3xl font-bold text-destructive">
                                    <XCircle className="h-6 w-6" />
                                    {missed}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Mastery threshold
                                </span>
                                <span className="font-medium">80%</span>
                            </div>
                            <Progress value={scorePercent} className="h-2" />
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                            <Button onClick={restartQuiz}>
                                <RotateCcw className="h-4 w-4" />
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/courses/practice/quiz')}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Quiz List
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-4 p-4">
            <div>
                <h1 className="text-xl font-semibold">{course.courseTitle} Quiz</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Choose the best answer and move through each question.
                </p>
            </div>
            <Card className="border-border/60 shadow-sm">
                <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <CardTitle>
                            Question {currentIndex + 1} of {quizzes.length}
                        </CardTitle>
                        <Badge variant="secondary">
                            {Math.round(progressPercent)}%
                        </Badge>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-base font-medium leading-7">
                        {currentQuestion.question}
                    </p>
                    <div className="space-y-3">
                        {currentQuestion.options?.map((option, optionIndex) => {
                            const isSelected = selectedOption === option;
                            return (
                                <button
                                    key={`${option}-${optionIndex}`}
                                    type="button"
                                    onClick={() => setSelectedOption(option)}
                                    className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition ${
                                        isSelected
                                            ? 'border-primary bg-primary/10 shadow-sm'
                                            : 'border-border hover:bg-muted/50'
                                    }`}
                                >
                                    <span
                                        className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                            isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {String.fromCharCode(65 + optionIndex)}
                                    </span>
                                    <span className="pt-0.5">{option}</span>
                                </button>
                            );
                        })}
                    </div>
                    <Button
                        className="w-full sm:w-auto"
                        onClick={onNext}
                        disabled={!selectedOption}
                    >
                        {currentIndex === quizzes.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Quiz;
