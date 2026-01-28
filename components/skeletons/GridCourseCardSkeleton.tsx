import React from 'react';
import CourseCardSkeleton from './CourseCardSkeleton';

const GridCourseCardSkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
            ))}
        </div>
    );
};

export default GridCourseCardSkeleton;
