'use client';

import { Suspense } from 'react';
import Loading from '@/components/Shared/Loading';
import SearchCourseContent from '../_components/SearchCourseContent';

export default function SearchPage() {
    return (
        <Suspense fallback={<Loading message="Loading search..." />}>
            <SearchCourseContent />
        </Suspense>
    );
}
