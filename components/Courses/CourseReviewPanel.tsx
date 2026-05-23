'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { auth, db } from '@/lib/firebase';
import { Course } from '@/types/course';
import { onAuthStateChanged } from 'firebase/auth';
import {
    doc,
    getDoc,
    increment,
    runTransaction,
    serverTimestamp,
} from 'firebase/firestore';
import { Star } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

type ExistingReview = {
    rating: number;
    comment: string;
};

export default function CourseReviewPanel({
    course,
    completed,
}: {
    course: Course;
    completed: boolean;
}) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [existingReview, setExistingReview] =
        useState<ExistingReview | null>(null);
    const [editing, setEditing] = useState(false);
    const [loadingReview, setLoadingReview] = useState(true);
    const [stats, setStats] = useState({
        averageRating: Number(course.averageRating) || 0,
        reviewCount: Number(course.reviewCount) || 0,
    });
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        setStats({
            averageRating: Number(course.averageRating) || 0,
            reviewCount: Number(course.reviewCount) || 0,
        });
    }, [course.averageRating, course.reviewCount]);

    useEffect(() => {
        if (!completed) return;

        setLoadingReview(true);

        const unsubscribe = onAuthStateChanged(auth, async user => {
            if (!user) {
                setExistingReview(null);
                setRating(0);
                setComment('');
                setEditing(false);
                setLoadingReview(false);
                return;
            }

            try {
                const reviewRef = doc(db, 'course', course.id, 'reviews', user.uid);
                const reviewSnap = await getDoc(reviewRef);

                if (reviewSnap.exists()) {
                    const review = reviewSnap.data();
                    const savedReview = {
                        rating: Number(review.rating) || 0,
                        comment: String(review.comment || ''),
                    };

                    setExistingReview(savedReview);
                    setRating(savedReview.rating);
                    setComment(savedReview.comment);
                    setEditing(false);
                } else {
                    setExistingReview(null);
                    setRating(0);
                    setComment('');
                    setEditing(true);
                }
            } catch (error) {
                console.error('Failed to load review:', error);
                toast.error('Could not check your existing review.');
            } finally {
                setLoadingReview(false);
            }
        });

        return () => unsubscribe();
    }, [completed, course.id]);

    if (!completed) return null;

    const submitReview = () => {
        if (!rating) {
            toast.error('Choose a rating first.');
            return;
        }

        startTransition(async () => {
            const user = auth.currentUser;
            if (!user?.email) {
                toast.error('Please sign in again.');
                return;
            }

            const courseRef = doc(db, 'course', course.id);
            const reviewRef = doc(db, 'course', course.id, 'reviews', user.uid);

            try {
                let submittedStats = stats;

                await runTransaction(db, async transaction => {
                    const [courseSnap, reviewSnap] = await Promise.all([
                        transaction.get(courseRef),
                        transaction.get(reviewRef),
                    ]);
                    const current = courseSnap.data() || {};
                    const currentAverage = Number(current.averageRating) || 0;
                    const currentCount = Number(current.reviewCount) || 0;
                    const previousRating = Number(reviewSnap.data()?.rating) || 0;
                    const nextCount = reviewSnap.exists()
                        ? currentCount
                        : currentCount + 1;
                    const nextTotal =
                        currentAverage * currentCount - previousRating + rating;
                    const nextAverage = nextCount > 0 ? nextTotal / nextCount : rating;
                    const roundedAverage = Number(nextAverage.toFixed(2));

                    transaction.set(
                        reviewRef,
                        {
                            rating,
                            comment: comment.trim(),
                            courseId: course.id,
                            courseTitle: course.courseTitle,
                            userEmail: user.email,
                            updatedAt: serverTimestamp(),
                            createdAt: reviewSnap.exists()
                                ? reviewSnap.data()?.createdAt || serverTimestamp()
                                : serverTimestamp(),
                        },
                        { merge: true },
                    );

                    transaction.set(
                        courseRef,
                        {
                            averageRating: roundedAverage,
                            reviewCount: reviewSnap.exists()
                                ? currentCount
                                : increment(1),
                        },
                        { merge: true },
                    );

                    submittedStats = {
                        averageRating: roundedAverage,
                        reviewCount: nextCount,
                    };
                });

                const savedReview = {
                    rating,
                    comment: comment.trim(),
                };

                setStats(submittedStats);
                setExistingReview(savedReview);
                setRating(savedReview.rating);
                setComment(savedReview.comment);
                setEditing(false);
                toast.success(
                    existingReview
                        ? 'Your review has been updated.'
                        : 'Thanks for reviewing this course.',
                );
            } catch (error) {
                console.error('Failed to submit review:', error);
                toast.error('Could not save your review.');
            }
        });
    };

    return (
        <section className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Course review
                    </p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight">
                        Rate this learning path
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Your rating helps improve recommendations for other learners.
                    </p>
                </div>
                <div className="text-sm text-muted-foreground">
                    Current: {stats.averageRating.toFixed(1)} from{' '}
                    {stats.reviewCount} review{stats.reviewCount !== 1 ? 's' : ''}
                </div>
            </div>

            {loadingReview ? (
                <div className="mt-5 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    Checking your saved review...
                </div>
            ) : existingReview && !editing ? (
                <div className="mt-5 rounded-lg border bg-muted/40 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold">
                                Your review is saved
                            </p>
                            <div className="mt-2 flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map(value => (
                                    <Star
                                        key={value}
                                        className="size-5"
                                        fill={
                                            value <= existingReview.rating
                                                ? 'currentColor'
                                                : 'none'
                                        }
                                    />
                                ))}
                            </div>
                            {existingReview.comment ? (
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {existingReview.comment}
                                </p>
                            ) : null}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditing(true)}
                        >
                            Edit review
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="mt-5 space-y-3">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(value => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRating(value)}
                                className="rounded-md p-1 text-yellow-500 transition hover:bg-muted"
                                aria-label={`Rate ${value} stars`}
                            >
                                <Star
                                    className="size-6"
                                    fill={value <= rating ? 'currentColor' : 'none'}
                                />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                        placeholder="What made this course useful?"
                        className="min-h-24"
                    />
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            onClick={submitReview}
                            disabled={pending}
                        >
                            {pending
                                ? 'Saving...'
                                : existingReview
                                  ? 'Update review'
                                  : 'Submit review'}
                        </Button>
                        {existingReview ? (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setRating(existingReview.rating);
                                    setComment(existingReview.comment);
                                    setEditing(false);
                                }}
                            >
                                Cancel
                            </Button>
                        ) : null}
                    </div>
                </div>
            )}
        </section>
    );
}
