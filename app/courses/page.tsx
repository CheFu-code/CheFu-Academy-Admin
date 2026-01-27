'use client';

import AllCoursesUI from '@/components/Courses/UI/AllCoursesUI';
import { getCoursesFromCache } from '@/helpers/courseCache';
import { CoursesQuery } from '@/lib/firestore/courseQueries';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CoursesPage() {
    const router = useRouter();
    const {
        user,
        fetchCourses,
        fetchMoreCourses,
        courses,
        setCourses,
        setHasMore,
        fetchingCourses,
        setFetchingCourses,
        loadingMore,
    } = CoursesQuery();

    // Initial fetch
    useEffect(() => {
        if (!user?.email || courses.length) return;
        fetchCourses();
    }, [user?.email, fetchCourses, courses]);

    useEffect(() => {
        const cachedCourses = getCoursesFromCache();
        if (cachedCourses?.length) {
            setCourses(cachedCourses);
            setHasMore(true);
        } else {
            setFetchingCourses(true);
        }
    }, [setCourses, setHasMore, setFetchingCourses]);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.body.scrollHeight;

            if (scrollTop + windowHeight >= fullHeight - 100) {
                fetchMoreCourses();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchMoreCourses]);

    const goToCourseView = (courseId?: string) => {
        if (!courseId) return;
        router.push(`/courses/course-view/${courseId}`);
    };
    return (
        <AllCoursesUI
            fetchingCourses={fetchingCourses}
            courses={courses}
            loadingMore={loadingMore}
            goToCourseView={goToCourseView}
        />
    );
}
