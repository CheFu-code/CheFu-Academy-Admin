import React from 'react';

const DeleteReviewModal = ({
    loading,
    setDeleteReviewModal,
    setEditingReviewId,
    handleDeleteReview,
}: {
    loading: boolean;
    setDeleteReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
    setEditingReviewId: React.Dispatch<React.SetStateAction<string | null>>;
    handleDeleteReview: () => Promise<void>;
}) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm">
                <h3 className="text-lg font-bold text-black mb-4">
                    Delete Review
                </h3>
                <p className="text-sm sm:text-base mb-4 text-black">
                    Are you sure you want to delete this review? This action
                    cannot be undone.
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
    );
};

export default DeleteReviewModal;
