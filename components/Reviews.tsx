import React, { useEffect, useState } from 'react';
import { UserReviews, Video } from '@/types/video';
import { DeleteIcon, Pencil, PlusIcon, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase';
import { useAuthUser } from '@/hooks/useAuthUser';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    QueryDocumentSnapshot,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { Button } from './ui/button';
import Image from 'next/image';

type ReviewsProps = {
    video: Video;
};

const Reviews = ({ video }: ReviewsProps) => {
    const [reviews, setReviews] = useState<UserReviews[]>([]);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [addReviewModal, setAddReviewModal] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [editReviewModal, setEditReviewModal] = useState(false);
    const [deleteReviewModal, setDeleteReviewModal] = useState(false);

    const { user } = useAuthUser();

    const hasReviewed = () =>
        user?.uid ? reviews.some((rev) => rev.userId === user.uid) : false;

    // fetch reviews
    useEffect(() => {
        if (!video || !video.id) return;

        const reviewsRef = collection(db, 'videos', video.id, 'reviews');
        const q = query(reviewsRef, orderBy('createdAt', 'desc'));

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
            })) as UserReviews[];
            setReviews(data);
        });

        return () => unsub();
    }, [video]);

    const handleSubmitReview = async () => {
        if (!video?.id) return toast.warning('Invalid video');
        if (!user?.uid || !user?.fullname)
            return toast.warning("You're not logged in properly");
        if (hasReviewed())
            return toast.warning('You already reviewed this video');
        if (rating === 0) return toast.warning('Please select a rating');
        if (reviewText.trim() === '')
            return toast.warning('Please write a review...');

        setLoading(true);
        try {
            const reviewsCollection = collection(
                db,
                'videos',
                video.id,
                'reviews',
            );
            await addDoc(reviewsCollection, {
                userId: user.uid,
                username: user.fullname,
                email: user.email || '',
                avatar: user.profilePicture || '',
                rating,
                comment: reviewText.trim(),
                videoId: video.id,
                createdAt: serverTimestamp(),
            });

            setReviewText('');
            setRating(0);
            setAddReviewModal(false);
            toast.success('Review submitted!');
        } catch (err) {
            console.error('Error submitting review:', err);
            toast.error('Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    const handleEditReview = async () => {
        if (!video || !editingReviewId) return;
        if (user?.uid !== auth.currentUser?.uid) {
            toast.warning('You can only edit your own reviews');
            return;
        }
        setLoading(true);

        if (rating === 0) {
            toast.warning('Please select a rating');
            setLoading(false);
            return;
        }
        if (reviewText.trim() === '') {
            toast.warning('Please write a review');
            setLoading(false);
            return;
        }

        try {
            if (!video.id) {
                toast.warning('Invalid video ID for update.');
                setLoading(false);
                return;
            }
            const updatedReview = {
                rating,
                comment: reviewText.trim(),
                updatedAt: serverTimestamp(),
            };

            const reviewRef = doc(
                db,
                'videos',
                video.id,
                'reviews',
                editingReviewId,
            );
            await updateDoc(reviewRef, updatedReview);

            // update local state
            setReviews((prev) =>
                prev.map((rev) =>
                    rev.id === editingReviewId
                        ? { ...rev, ...updatedReview }
                        : rev,
                ),
            );

            // reset state
            setEditingReviewId(null);
            setReviewText('');
            setRating(0);
            setEditReviewModal(false);

            toast.success('Review updated successfully');
        } catch (error) {
            console.error('Error updating review: ', error);
            toast.error('Failed to update review');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!video || !video.id) {
            toast.warning('Invalid video');
            return;
        }
        if (!user?.uid) {
            toast.warning("You're not logged in properly");
            return;
        }
        if (!editingReviewId) {
            toast.warning('No review selected');
            return;
        }

        setLoading(true);
        try {
            const reviewRef = doc(
                db,
                'videos',
                video.id,
                'reviews',
                editingReviewId,
            );

            await deleteDoc(reviewRef);

            // update local state
            setReviews((prev) =>
                prev.filter((rev) => rev.id !== editingReviewId),
            );

            // reset state
            setEditingReviewId(null);
            setDeleteReviewModal(false);

            toast.success('Review deleted successfully');
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <h2 className="font-bold text-lg sm:text-xl md:text-2xl">
                    Student Reviews
                </h2>

                <div className="flex flex-row gap-3 items-center">
                    <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm sm:text-base md:text-lg font-medium">
                            {reviews.length > 0
                                ? (
                                      reviews.reduce(
                                          (acc, r) => acc + r.rating,
                                          0,
                                      ) / reviews.length
                                  ).toFixed(1)
                                : '0.0'}
                        </span>
                    </div>

                    <Button
                        onClick={() => {
                            setAddReviewModal(true);
                        }}
                        className=" bg-green-600 hover:bg-green-700  cursor-pointer"
                    >
                        <PlusIcon className="size-4" /> Add Review
                    </Button>
                </div>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center text-gray-600 text-sm sm:text-base md:text-lg">
                    No reviews yet. Be the first to leave one!
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {reviews.map((rev) => (
                        <div
                            key={rev.id}
                            className="bg-gray-200/50 p-3 rounded-lg shadow-sm flex flex-col gap-1"
                        >
                            <div className="flex flex-row items-start gap-3">
                                <Image
                                    width={10}
                                    height={10}
                                    src={rev.avatar}
                                    alt={rev.username}
                                    className="h-10 w-10 rounded-full object-cover"
                                />

                                <div className="flex-1 flex justify-between items-center">
                                    <p className="font-semibold">
                                        {rev.username}
                                    </p>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {Array.from({
                                                length: rev.rating,
                                            }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-4 w-4 fill-yellow-500"
                                                />
                                            ))}
                                        </div>
                                        {user?.uid === rev.userId && (
                                            <div className="flex flex-row items-center gap-3">
                                                <Pencil
                                                    className="h-4 w-4 cursor-pointer"
                                                    onClick={() => {
                                                        setEditingReviewId(
                                                            rev.id,
                                                        );
                                                        setReviewText(
                                                            rev.comment,
                                                        );
                                                        setRating(rev.rating);
                                                        setEditReviewModal(
                                                            true,
                                                        );
                                                    }}
                                                />
                                                <Trash2
                                                    className="h-4 w-4 text-red-500 cursor-pointer"
                                                    onClick={() => {
                                                        setEditingReviewId(
                                                            rev.id,
                                                        );
                                                        setDeleteReviewModal(
                                                            true,
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm sm:text-base mt-1">
                                {rev.comment}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Review Modal */}
            {editReviewModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg text-black font-bold mb-4">
                            Edit Your Review
                        </h3>

                        <div className="flex gap-1 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-6 w-6 cursor-pointer ${
                                        rating > i
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-500'
                                    }`}
                                    onClick={() => setRating(i + 1)}
                                />
                            ))}
                        </div>

                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full text-black border rounded-md p-2 mb-4 text-sm placeholder-black"
                            rows={4}
                            placeholder="Edit your review..."
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                disabled={loading}
                                onClick={() => {
                                    setEditReviewModal(false);
                                    setEditingReviewId(null);
                                    setReviewText('');
                                    setRating(0);
                                }}
                                className="px-3 py-1 bg-gray-300 text-black rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditReview}
                                disabled={loading}
                                className="px-3 py-1 cursor-pointer bg-green-600 text-white rounded-md disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Review Modal */}
            {deleteReviewModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-sm">
                        <h3 className="text-lg font-bold text-black mb-4">
                            Delete Review
                        </h3>
                        <p className="text-sm sm:text-base mb-4 text-black">
                            Are you sure you want to delete this review? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                disabled={loading}
                                onClick={() => {
                                    setDeleteReviewModal(false);
                                    setEditingReviewId(null);
                                }}
                                className="px-3 py-1 bg-gray-300 text-black rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteReview}
                                disabled={loading}
                                className="px-3 py-1 bg-red-600 text-white rounded-md disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Review Modal */}
            {addReviewModal && (
                <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg text-black font-bold mb-4">
                            Write a Review
                        </h3>

                        <div className="flex gap-1 mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-6 w-6 cursor-pointer ${
                                        rating > i
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-500'
                                    }`}
                                    onClick={() => setRating(i + 1)}
                                />
                            ))}
                        </div>

                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full text-black border rounded-md p-2 mb-4 text-sm placeholder-black"
                            rows={4}
                            placeholder="Write your review..."
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                variant={'destructive'}
                                disabled={loading}
                                onClick={() => setAddReviewModal(false)}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitReview}
                                disabled={
                                    loading || !reviewText.trim() || !rating
                                }
                                className="px-3 py-1 bg-green-600 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
