import { useRouter } from 'next/navigation';

export const useCourseView = () => {
    const router = useRouter();
    const handleClick = (id: string) => {
        router.push(`/courses/my-courses/course-view/${id}`);
    };

    return { handleClick };
};
