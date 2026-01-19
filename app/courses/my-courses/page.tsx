'use client';

import LoadingMyCourse from '@/components/Courses/LoadingMyCourse';
import NoCourseYet from '@/components/Courses/NoCourseYet';
import MyCourseUI from '@/components/Courses/UI/MyCourseUI';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useCourseView } from '@/hooks/useCourseView';
import { useGetMyCourse } from '@/hooks/useGetMyCourses';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function MyCourses() {
    const router = useRouter();
    const { handleClick } = useCourseView();
    const { user, loading: userLoading } = useAuthUser();
    const { courses, loading, setLoading, fetchCourses } = useGetMyCourse();

    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged((user) => {
            if (user) fetchCourses(user);
            else setLoading(false);
        });
        return () => unsubscribe();
    }, [fetchCourses, setLoading]);

    useEffect(() => {
        // Only run this after both user and courses are loaded
        if (userLoading || loading) return;

        if (!user) {
            router.replace('/login');
            return;
        }

        if (courses.length > 0 && courses[0].createdBy !== user.email) {
            toast.error('You are not authorized to view this course!');
            router.replace('/courses');
        }
    }, [courses, user, userLoading, loading, router]);

    if (loading) return <LoadingMyCourse />;
    if (courses.length === 0) return <NoCourseYet />;

    return <MyCourseUI courses={courses} handleClick={handleClick} />;
}
