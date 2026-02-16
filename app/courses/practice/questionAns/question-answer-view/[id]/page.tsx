'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePracticeCourses } from '@/hooks/usePracticeCourses';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const QuestionAns = () => {
    const params = useParams();
    const router = useRouter();
    const { courses, loading } = usePracticeCourses();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const course = courses.find(item => item.id === id);
    const questionAns = course?.qa || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [knownCount, setKnownCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        setCurrentIndex(0);
        setRevealed(false);
        setKnownCount(0);
        setReviewCount(0);
        setFinished(false);
    }, [id]);

    const renderStateCard = ({
        title,
        description,
        showLoadingPulse = false,
    }: {
        title: string;
        description: string;
        showLoadingPulse?: boolean;
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
                    {!showLoadingPulse && (
                        <Button
                            variant="outline"
                            onClick={() => router.push('/courses/practice/questionAns')}
                        >
                            Back to Q&A List
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    if (loading) {
        return renderStateCard({
            title: 'Loading Q&A Practice',
            description: 'Please wait while we fetch your Q&A session.',
            showLoadingPulse: true,
        });
    }

    if (!course) {
        return renderStateCard({
            title: 'Course Not Found',
            description:
                'This Q&A link is invalid for your account or no longer exists.',
        });
    }

    if (questionAns.length === 0) {
        return (
            <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    This course does not have Q&A content yet.
                </p>
                <Button
                    variant="outline"
                    onClick={() => router.push('/courses/practice/questionAns')}
                >
                    Back to Q&A List
                </Button>
            </div>
        );
    }

    const currentItem = questionAns[currentIndex];

    const handleSelfCheck = (known: boolean) => {
        if (known) {
            setKnownCount(prev => prev + 1);
        } else {
            setReviewCount(prev => prev + 1);
        }

        const isLast = currentIndex === questionAns.length - 1;
        if (isLast) {
            setFinished(true);
            return;
        }

        setCurrentIndex(prev => prev + 1);
        setRevealed(false);
    };

    const restartPractice = () => {
        setCurrentIndex(0);
        setRevealed(false);
        setKnownCount(0);
        setReviewCount(0);
        setFinished(false);
    };

    if (finished) {
        const mastery = Math.round((knownCount / questionAns.length) * 100);
        return (
            <div className="space-y-4">
                <h1 className="text-xl font-semibold">{course.courseTitle} Q&A Practice</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Practice Complete</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p>
                            Mastery score: <span className="font-semibold">{mastery}%</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            You marked <span className="font-semibold">{knownCount}</span> as
                            known and <span className="font-semibold">{reviewCount}</span> for
                            review out of {questionAns.length}.
                        </p>
                        <div className="flex gap-2">
                            <Button onClick={restartPractice}>Practice Again</Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/courses/practice/questionAns')}
                            >
                                Back to Q&A List
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">{course.courseTitle} Q&A Practice</h1>
            <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questionAns.length}
            </p>
            <Card>
                <CardHeader>
                    <CardTitle>Think first, then reveal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Question</p>
                        <p className="text-base">{currentItem.question}</p>
                    </div>

                    {!revealed ? (
                        <Button onClick={() => setRevealed(true)}>Reveal Answer</Button>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-md border bg-muted/30 p-3">
                                <p className="text-xs text-muted-foreground">Answer</p>
                                <p>{currentItem.answer}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={() => handleSelfCheck(true)}>
                                    I got it
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSelfCheck(false)}
                                >
                                    Need review
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default QuestionAns;
