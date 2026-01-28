import React from 'react';

const VideoCardSkeleton = () => {
    return (
        <div className="border rounded-lg overflow-hidden shadow-md animate-pulse">
            {/* Thumbnail skeleton */}
            <div className="relative w-full aspect-video bg-muted">
                {/* Category badge skeleton */}
                <div className="absolute top-2 left-2 h-5 w-20 rounded-xl bg-black/30" />
            </div>

            {/* Video info skeleton */}
            <div className="p-4 flex flex-col gap-2">
                {/* Title */}
                <div className="h-4 sm:h-5 w-3/4 bg-muted rounded" />

                {/* Level */}
                <div className="h-3 sm:h-4 w-1/2 bg-muted rounded" />

                {/* Duration */}
                <div className="h-3 sm:h-4 w-1/3 bg-muted rounded" />
            </div>
        </div>
    );
};

export default VideoCardSkeleton;
