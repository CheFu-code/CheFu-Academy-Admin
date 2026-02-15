import React from 'react'
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

const AccountSkeleton = () => {
    return (
        <div className="container mx-auto max-w-4xl p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-4">
                <Skeleton className="h-10 w-10 sm:h-16 sm:w-16 rounded-full" />
                <div className="flex flex-col gap-2 w-full max-w-sm">
                    <Skeleton className="h-5 w-40 sm:h-7 sm:w-56" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>

            <Separator className="my-3 sm:my-4" />

            <div className="flex w-full overflow-x-auto no-scrollbar space-x-1 sm:space-x-2 px-1 sm:px-2">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
            </div>

            <div className="mt-6 space-y-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
            </div>
        </div>
    );
};


export default AccountSkeleton