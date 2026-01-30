import React from 'react';

const CourseLearningSkeleton = () => {
    return (
        <div className="min-h-screen flex flex-col p-4 max-w-3xl mx-auto space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
                <div className="h-10 w-3/4 bg-gray-300 rounded-md"></div>
                <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            </div>

            {/* Progress skeleton */}
            <div className="h-2 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-1/4 bg-gray-300 rounded mt-1"></div>

            {/* Content skeleton */}
            <div className="flex-1 space-y-4">
                <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
            </div>

            {/* Next / Finish button skeleton */}
            <div className="mt-auto h-12 bg-gray-300 rounded-full w-full"></div>
        </div>
    );
};

export default CourseLearningSkeleton;
