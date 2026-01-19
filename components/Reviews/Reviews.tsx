import { useAuthUser } from '@/hooks/useAuthUser';
import { auth, db } from '@/lib/firebase';
import { UserReviews, Video } from '@/types/video';
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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Header from './Header';
import AddReviewModal from './Modals/AddReviewModal';
import DeleteReviewModal from './Modals/DeleteReviewModal';
import EditReviewModal from './Modals/EditReviewModal';
import NoReviews from './ReviewsList/NoReviews';
import ReviewsList from './ReviewsList/ReviewsList';

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
            <Header reviews={reviews} setAddReviewModal={setAddReviewModal} />

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <NoReviews />
            ) : (
                <ReviewsList
                    reviews={reviews}
                    user={user}
                    setEditingReviewId={setEditingReviewId}
                    setReviewText={setReviewText}
                    setRating={setRating}
                    setEditReviewModal={setEditReviewModal}
                    setDeleteReviewModal={setDeleteReviewModal}
                />
            )}

            {/* Edit Review Modal */}
            {editReviewModal && (
                <EditReviewModal
                    rating={rating}
                    setRating={setRating}
                    reviewText={reviewText}
                    setReviewText={setReviewText}
                    loading={loading}
                    setEditReviewModal={setEditReviewModal}
                    setEditingReviewId={setEditingReviewId}
                    handleEditReview={handleEditReview}
                />
            )}

            {/* Delete Review Modal */}
            {deleteReviewModal && (
                <DeleteReviewModal
                    loading={loading}
                    setDeleteReviewModal={setDeleteReviewModal}
                    setEditingReviewId={setEditingReviewId}
                    handleDeleteReview={handleDeleteReview}
                />
            )}

            {/* Add Review Modal */}
            {addReviewModal && (
                <AddReviewModal
                    rating={rating}
                    setRating={setRating}
                    reviewText={reviewText}
                    setReviewText={setReviewText}
                    loading={loading}
                    setAddReviewModal={setAddReviewModal}
                    handleSubmitReview={handleSubmitReview}
                />
            )}
        </div>
    );
};

export default Reviews;
