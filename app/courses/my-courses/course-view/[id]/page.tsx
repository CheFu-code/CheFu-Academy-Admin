'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import NoCourse from '@/components/Courses/noCourse';
import CourseViewUI from '@/components/Courses/UI/CourseViewUI';
import Loading from '@/components/Shared/Loading';
import { useCourseFunctions } from '@/hooks/useCourseFunctions';
import { db } from '@/lib/firebase';
import { Course } from '@/types/course';
import { toast } from 'sonner';

const CourseView = ({ course: initialCourse }: { course?: Course }) => {
    const params = useParams();
    const courseId = params.id;
    const [course, setCourse] = useState<Course | undefined>(initialCourse);
    const [loading, setLoading] = useState(!initialCourse);
    const {
        user,
        router,
        handleChapterClick,
        completedChaptersState,
        setCompletedChaptersState,
    } = useCourseFunctions(course);

    useEffect(() => {
        setCompletedChaptersState(course?.completedChapter || []);
    }, [course?.completedChapter, setCompletedChaptersState]);


    useEffect(() => {
        if (!initialCourse && courseId) {
            const fetchCourse = async () => {
                const docRef = doc(db, 'course', courseId as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists())
                    setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
                setLoading(false);
            };
            fetchCourse();
        }
    }, [courseId, initialCourse]);

    useEffect(() => {
        // Only run after both user and course have loaded
        if (!user || loading) return;

        if (course && course.createdBy !== user.email) {
            toast.error('You are not authorized to view this course!');
            router.replace('/courses');
        }
    }, [user, course, loading, router]);

    if (loading) return <Loading message="Loading course data..." />;
    if (!course) return <NoCourse />;

    const completedChapters = course.completedChapter?.length || 0;
    const totalChapters = course.chapters?.length || 0;
    const progress =
        totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

    return (
        <CourseViewUI
            course={course}
            completedChapters={completedChapters}
            totalChapters={totalChapters}
            progress={progress}
            handleChapterClick={handleChapterClick}
            completedChaptersState={completedChaptersState}
        />
    );
};

export default CourseView;
