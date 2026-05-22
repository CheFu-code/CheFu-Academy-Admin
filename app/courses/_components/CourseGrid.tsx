import CourseCard from '@/components/Shared/CourseCard';
import EmptyCourse from '@/components/Courses/UI/EmptyCourse';
import { Course } from '@/types/course';

export default function CourseGrid({ courses }: { courses: Course[] }) {
    if (!courses.length) {
        return <EmptyCourse />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {courses.map(course => (
                <CourseCard
                    key={course.id}
                    id={course.id}
                    bannerImage={course.banner_image}
                    title={course.courseTitle}
                    description={course.description}
                    chaptersCount={course.chapters?.length || 0}
                />
            ))}
        </div>
    );
}
