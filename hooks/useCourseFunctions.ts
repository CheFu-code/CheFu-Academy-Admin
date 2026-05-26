import { Course } from '@/types/course';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { canAccessCourseAsLearner } from '@/lib/courseOwnership';
import {
    getNextRequiredChapterIndex,
    isCourseFullyCompleted,
} from '@/lib/courseProgress';
import { useAuthUser } from './useAuthUser';

export const useCourseFunctions = (course?: Course) => {
    const router = useRouter();
    const { user } = useAuthUser();

    const [completedChaptersState, setCompletedChaptersState] = useState<
        string[]
    >(course?.completedChapter || []);

    const handleChapterClick = async (idx: number) => {
        if (!course) return;

        const isCompleted = completedChaptersState.includes(idx.toString());
        const totalChapters = course.chapters?.length || 0;
        const completedCourse = isCourseFullyCompleted(
            totalChapters,
            completedChaptersState,
        );
        const nextChapterIndex = getNextRequiredChapterIndex(
            totalChapters,
            completedChaptersState,
        );

        if (!completedCourse && idx !== nextChapterIndex) {
            return;
        }

        if (
            canAccessCourseAsLearner(course, user) &&
            !user?.member &&
            isCompleted
        ) {
            return;
        }

        router.replace(
            `/courses/my-courses/course-view/${course.id}/course-learning?chapter=${idx}`,
        );
    };

    return {
        user,
        router,
        handleChapterClick,
        completedChaptersState,
        setCompletedChaptersState,
    };
};
