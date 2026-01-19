import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import React from 'react';

const AddReviewModal = ({
    rating,
    setRating,
    reviewText,
    setReviewText,
    loading,
    setAddReviewModal,
    handleSubmitReview,
}: {
    rating: number;
    reviewText: string;
    setRating: React.Dispatch<React.SetStateAction<number>>;
    setReviewText: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    setAddReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmitReview: () => Promise<string | number | undefined>;
}) => {
    return (
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
                        disabled={loading || !reviewText.trim() || !rating}
                        className="px-3 py-1 bg-green-600 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddReviewModal;
