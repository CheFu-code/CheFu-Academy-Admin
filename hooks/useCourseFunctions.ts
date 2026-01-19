import { Course } from '@/types/course';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthUser } from './useAuthUser';

export const useCourseFunctions = (course?: Course) => {
    const router = useRouter();
    const { user } = useAuthUser();

    const [completedChaptersState, setCompletedChaptersState] = useState<
        string[]
    >(course?.completedChapter || []);

    const handleChapterClick = async (idx: number) => {
        const isCompleted = completedChaptersState.includes(idx.toString());

        if (!user?.member && isCompleted) {
            toast.warning(
                'Chapter completed, subscribe to revisit this chapter.',
            );
            return;
        }

        router.replace(
            `/courses/my-courses/course-view/${course?.id}/course-learning?chapter=${idx}`,
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
