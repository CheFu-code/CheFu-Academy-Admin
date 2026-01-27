const CourseCardSkeleton = () => {
    return (
        <div className="rounded-xl border border-muted-foreground animate-pulse">
            {/* Image */}
            <div className="h-40 w-full bg-gray-300/40 dark:bg-gray-700/40 rounded-t-xl" />

            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 w-3/4 bg-gray-300/40 dark:bg-gray-700/40 rounded" />

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-300/40 dark:bg-gray-700/40 rounded" />
                    <div className="h-4 w-5/6 bg-gray-300/40 dark:bg-gray-700/40 rounded" />
                </div>

                {/* Chapters */}
                <div className="h-4 w-1/3 bg-gray-300/40 dark:bg-gray-700/40 rounded mt-4" />
            </div>
        </div>
    );
};

export default CourseCardSkeleton;
