'use client';

import AllCoursesUI from '@/components/Courses/UI/AllCoursesUI';
import { CoursesQuery } from '@/lib/firestore/courseQueries';
import { useEffect } from 'react';

export default function CoursesPage() {
    const {
        user,
        fetchCourses,
        fetchMoreCourses,
        courses,
        fetchingCourses,
        hasMore,
        loadingMore,
    } = CoursesQuery();

    // Initial fetch
    useEffect(() => {
        if (!user?.email || courses.length) return;
        fetchCourses();
    }, [user?.email, fetchCourses, courses]);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            console.log('scrolling, hasMore:', hasMore);
            if (loadingMore || !hasMore) return;

            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.body.scrollHeight;

            if (scrollTop + windowHeight >= fullHeight - 100) {
                fetchMoreCourses();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchMoreCourses, hasMore, loadingMore]);

    return (
        <AllCoursesUI
            fetchingCourses={fetchingCourses}
            courses={courses}
            loadingMore={loadingMore}
        />
    );
}
