import Header from '@/components/Shared/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Course } from '@/types/course';
import HomeCourseCard from '../HomeCourseCard';

const MyCourseUI = ({ courses }: { courses: Course[] }) => {
    return (
        <>
            <Header
                header="My Courses"
                description="Your active learning journey"
            />
            <Card className="space-y-3">
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => {
                        const completedChapters =
                            course?.completedChapter?.length || 0;
                        const totalChapters = course.chapters.length;
                        const progress =
                            totalChapters > 0
                                ? (completedChapters / totalChapters) * 100
                                : 0;

                        return (
                            <HomeCourseCard
                                key={course.id}
                                id={course.id}
                                banner_image={course.banner_image}
                                courseTitle={course.courseTitle}
                                category={course.category}
                                totalChapters={totalChapters}
                                completedChapters={completedChapters}
                                progress={progress}
                            />
                        );
                    })}
                </CardContent>
            </Card>
        </>
    );
};

export default MyCourseUI;
