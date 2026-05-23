'use client';

import Header from '@/components/Shared/Header';
import { Course } from '@/types/course';
import HomeCourseCard from '../HomeCourseCard';
import { PlusSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MyCourseUI = ({ courses }: { courses: Course[] }) => {
    const router = useRouter();
    return (
        <>
            <div className="flex justify-between items-center">
                <Header
                    header="My Courses"
                    description="Your active learning journey"
                />
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={() => router.push('/courses/create-course')}
                        className="cursor-pointer hover:bg-gray-100/20 transition-colors duration-200 rounded-md p-2 flex items-center gap-2"
                    >
                        <PlusSquare className="size-5" />
                    </button>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>
        </>
    );
};

export default MyCourseUI;
