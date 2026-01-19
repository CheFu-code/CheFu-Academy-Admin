import { PlusIcon, Star } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { UserReviews } from '@/types/video';

const Header = ({
    reviews,
    setAddReviewModal,
}: {
    reviews: UserReviews[];
    setAddReviewModal: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
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
    );
};

export default Header;
