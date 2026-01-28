'use client';

import NoCourseYet from '@/components/Courses/NoCourseYet';
import MyCourseUI from '@/components/Courses/UI/MyCourseUI';
import GridCourseCardSkeleton from '@/components/skeletons/GridCourseCardSkeleton';
import { useGetMyCourse } from '@/hooks/useGetMyCourses';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';

export default function MyCourses() {
    const { courses, loading, setLoading, fetchCourses } = useGetMyCourse();

    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged((user) => {
            if (user) fetchCourses(user);
            else setLoading(false);
        });
        return () => unsubscribe();
    }, [fetchCourses, setLoading]);

    if (loading) return <GridCourseCardSkeleton />;
    if (courses.length === 0) return <NoCourseYet />;

    return <MyCourseUI courses={courses} />;
}
