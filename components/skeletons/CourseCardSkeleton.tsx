import React from 'react';

const CourseCardSkeleton = () => {
    return (
        <div className="max-w-full rounded-xl border border-muted-foreground animate-pulse">
            {/* Banner skeleton */}
            <div className="w-full h-32 sm:h-40 rounded-t-xl bg-muted" />

            {/* Header */}
            <div className="p-6 pb-2">
                {/* Title skeleton */}
                <div className="h-4 sm:h-5 md:h-6 w-3/4 bg-muted rounded mb-4" />

                {/* Description skeleton (2 lines) */}
                <div className="space-y-2">
                    <div className="h-3 sm:h-4 w-full bg-muted rounded" />
                    <div className="h-3 sm:h-4 w-5/6 bg-muted rounded" />
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-4">
                {/* Chapters skeleton */}
                <div className="h-3 sm:h-4 w-24 bg-muted rounded mt-4" />
            </div>
        </div>
    );
};

export default CourseCardSkeleton;
