'use client';

import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import NoCourse from '@/components/Courses/noCourse';
import CourseViewUI from '@/components/Courses/UI/CourseViewUI';
import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton';
import { useFavoriteCourse } from '@/hooks/useFavoriteCourse';
import { useCourseFunctions } from '@/hooks/useCourseFunctions';
import { canAccessCourseAsLearner } from '@/lib/courseOwnership';
import { db } from '@/lib/firebase';
import { Course } from '@/types/course';
import { toast } from 'sonner';

const CourseView = ({ course: initialCourse }: { course?: Course }) => {
    const params = useParams();
    const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [course, setCourse] = useState<Course | undefined>(initialCourse);
    const [loading, setLoading] = useState(!initialCourse);
    const {
        user,
        router,
        handleChapterClick,
        completedChaptersState,
        setCompletedChaptersState,
    } = useCourseFunctions(course);
    const { isFavorite, favoritePending, toggleFavorite } = useFavoriteCourse(
        course,
        user,
    );

    useEffect(() => {
        setCompletedChaptersState(course?.completedChapter || []);
    }, [course?.completedChapter, setCompletedChaptersState]);

    useEffect(() => {
        if (!courseId) return;

        if (initialCourse && initialCourse.id === courseId) {
            setCourse(initialCourse);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchCourse = async () => {
            try {
                setLoading(true);
                setCourse(undefined);

                const docRef = doc(db, 'course', courseId);
                const docSnap = await getDoc(docRef);

                if (cancelled) return;

                if (docSnap.exists()) {
                    setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
                } else {
                    setCourse(undefined);
                }
            } catch (error) {
                console.error('Failed to fetch course:', error);
                toast.error('Failed to load course. Please try again.');
                if (!cancelled) setCourse(undefined);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchCourse();

        return () => {
            cancelled = true;
        };
    }, [courseId, initialCourse]);

    useEffect(() => {
        if (!user || loading) return;
        if (course && !canAccessCourseAsLearner(course, user)) {
            toast.error('You are not authorized to view this course!');
            router.replace('/courses');
        }
    }, [user, course, loading, router]);

    if (loading) return <CourseCardSkeleton />;
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
            isFavorite={isFavorite}
            favoritePending={favoritePending}
            toggleFavorite={toggleFavorite}
            router={router}
        />
    );
};

export default CourseView;
