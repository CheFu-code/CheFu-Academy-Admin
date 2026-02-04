'use client';

import AllCoursesUI from '@/components/Courses/UI/AllCoursesUI';
import { useCourseNavigation } from '@/hooks/useCourseNavigation';
import { useSafeNavigation } from '@/hooks/useSearchNavigation';
import { CoursesQuery } from '@/lib/firestore/courseQueries';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CoursesPage() {
    const router = useRouter();
    const {
        user,
        fetchCourses,
        fetchMoreCourses,
        courses,
        fetchingCourses,
        hasMore,
        loadingMore,
    } = CoursesQuery();
    const [search, setSearch] = useState('');
    const { goToSearchRes } = useSafeNavigation(search);
    const { goToCourseView } = useCourseNavigation();


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
            search={search}
            setSearch={setSearch}
            goToSearchRes={goToSearchRes}
            router={router}
            goToCourseView={goToCourseView}
        />
    );
}
