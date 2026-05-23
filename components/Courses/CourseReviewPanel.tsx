'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { auth, db } from '@/lib/firebase';
import { Course } from '@/types/course';
import { doc, increment, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Star } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function CourseReviewPanel({
    course,
    completed,
}: {
    course: Course;
    completed: boolean;
}) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [pending, startTransition] = useTransition();

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
                            averageRating: Number(nextAverage.toFixed(2)),
                            reviewCount: reviewSnap.exists()
                                ? currentCount
                                : increment(1),
                        },
                        { merge: true },
                    );
                });

                toast.success('Thanks for reviewing this course.');
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
                    Current: {(course.averageRating || 0).toFixed(1)} from{' '}
                    {course.reviewCount || 0} review
                    {(course.reviewCount || 0) !== 1 ? 's' : ''}
                </div>
            </div>

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
                <Button type="button" onClick={submitReview} disabled={pending}>
                    {pending ? 'Saving...' : 'Submit review'}
                </Button>
            </div>
        </section>
    );
}
