import { COURSES_CACHE_KEY } from '@/constants/cache';
import { Course } from '@/types/course';

const saveCoursesToCache = (courses: Course[]) => {
    localStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(courses));
};

const areCoursesDifferent = (a: Course[], b: Course[]) => {
    return JSON.stringify(a) !== JSON.stringify(b);
};

export { saveCoursesToCache, areCoursesDifferent };
