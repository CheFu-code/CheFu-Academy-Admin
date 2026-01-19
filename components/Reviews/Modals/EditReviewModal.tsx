import { Star } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

const EditReviewModal = ({
    rating,
    setRating,
    reviewText,
    setReviewText,
    loading,
    setEditReviewModal,
    setEditingReviewId,
    handleEditReview,
}: {
    rating: number;
    setRating: Dispatch<SetStateAction<number>>;
    reviewText: string;
    setReviewText: Dispatch<SetStateAction<string>>;
    loading: boolean;
    setEditReviewModal: Dispatch<SetStateAction<boolean>>;
    setEditingReviewId: Dispatch<SetStateAction<string | null>>;
    handleEditReview: () => Promise<void>;
}) => {
    return (
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
    );
};

export default EditReviewModal;
