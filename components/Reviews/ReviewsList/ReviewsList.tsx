import { User } from '@/types/user';
import { UserReviews } from '@/types/video';
import { Pencil, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';

const ReviewsList = ({
    reviews,
    user,
    setEditingReviewId,
    setReviewText,
    setRating,
    setEditReviewModal,
    setDeleteReviewModal,
}: {
    reviews: UserReviews[];
    user: User | null;
    setEditingReviewId: Dispatch<SetStateAction<string | null>>;
    setReviewText: Dispatch<SetStateAction<string>>;
    setRating: Dispatch<SetStateAction<number>>;
    setEditReviewModal: Dispatch<SetStateAction<boolean>>;
    setDeleteReviewModal: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
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
                            <p className="font-semibold">{rev.username}</p>
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
                                                setEditingReviewId(rev.id);
                                                setReviewText(rev.comment);
                                                setRating(rev.rating);
                                                setEditReviewModal(true);
                                            }}
                                        />
                                        <Trash2
                                            className="h-4 w-4 text-red-500 cursor-pointer"
                                            onClick={() => {
                                                setEditingReviewId(rev.id);
                                                setDeleteReviewModal(true);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="text-sm sm:text-base mt-1">{rev.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewsList;
