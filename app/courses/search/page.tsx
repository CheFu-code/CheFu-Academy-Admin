'use client';

import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton';
import { Suspense } from 'react';
import SearchCourseContent from '../_components/SearchCourseContent';

export default function SearchPage() {
    return (
        <Suspense fallback={<CourseCardSkeleton />}>
            <SearchCourseContent />
        </Suspense>
    );
}
