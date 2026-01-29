import { useRouter } from 'next/navigation';

export const useCourseNavigation = () => {
    const router = useRouter();

    const goToCourseView = (courseId: string) => {
        if (!courseId) return;
        router.push(`/courses/course-view/${courseId}`);
    };

    return { goToCourseView };
};
