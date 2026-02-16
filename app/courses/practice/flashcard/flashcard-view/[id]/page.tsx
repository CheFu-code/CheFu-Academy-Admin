'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePracticeCourses } from '@/hooks/usePracticeCourses';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Flashcard = () => {
    const params = useParams();
    const router = useRouter();
    const { courses, loading } = usePracticeCourses();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const course = courses.find(item => item.id === id);
    const flashcards = course?.flashcards || [];
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
                            onClick={() => router.push('/courses/practice/flashcard')}
                        >
                            Back to Flashcard List
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    if (loading) {
        return renderStateCard({
            title: 'Loading Flashcards',
            description: 'Please wait while we prepare your flashcard set.',
            showLoadingPulse: true,
        });
    }

    if (!course) {
        return renderStateCard({
            title: 'Course Not Found',
            description:
                'This flashcard link is invalid for your account or no longer exists.',
        });
    }

    if (flashcards.length === 0) {
        return renderStateCard({
            title: 'No Flashcards Available',
            description: 'This course exists, but no flashcards have been added yet.',
        });
    }

    const currentCard = flashcards[currentIndex];

    const handleSelfCheck = (known: boolean) => {
        if (known) {
            setKnownCount(prev => prev + 1);
        } else {
            setReviewCount(prev => prev + 1);
        }

        const isLast = currentIndex === flashcards.length - 1;
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
        const mastery = Math.round((knownCount / flashcards.length) * 100);
        return (
            <div className="space-y-4">
                <h1 className="text-xl font-semibold">{course.courseTitle} Flashcards</h1>
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
                            review out of {flashcards.length}.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Button onClick={restartPractice}>Practice Again</Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/courses/practice/flashcard')}
                            >
                                Back to Flashcard List
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">{course.courseTitle} Flashcards</h1>
            <p className="text-sm text-muted-foreground">
                Card {currentIndex + 1} of {flashcards.length}
            </p>
            <Card>
                <CardHeader>
                    <CardTitle>Think first, then reveal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md border p-4">
                        <p className="text-xs text-muted-foreground">Front</p>
                        <p className="text-base">{currentCard.front}</p>
                    </div>

                    {!revealed ? (
                        <Button onClick={() => setRevealed(true)}>Reveal Back</Button>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-md border bg-muted/30 p-4">
                                <p className="text-xs text-muted-foreground">Back</p>
                                <p>{currentCard.back}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={() => handleSelfCheck(true)}>
                                    I knew this
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSelfCheck(false)}
                                >
                                    Review again
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Flashcard;
