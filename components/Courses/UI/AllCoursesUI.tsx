'use client';

import Header from '@/components/Shared/Header';
import CourseCard from '@/components/Shared/CourseCard';
import GridCourseCardSkeleton from '@/components/skeletons/GridCourseCardSkeleton';
import { Input } from '@/components/ui/input';
import { Course } from '@/types/course';
import { PlusSquare, Search } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import EmptyCourse from './EmptyCourse';

const AllCoursesUI = ({
    fetchingCourses,
    courses,
    loadingMore,
    search,
    setSearch,
    goToSearchRes,
    router,
}: {
    fetchingCourses: boolean;
    courses: Course[];
    loadingMore: boolean;
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    goToSearchRes: () => void;
    router: ReturnType<typeof import('next/navigation').useRouter>;
    goToCourseView: (courseId: string) => void;
}) => {
    return (
        <div className="min-h-screen px-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <Header
                    header="Courses"
                    description="Learn something new today."
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
            <div className="relative mt-1">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search courses by name, category..."
                    aria-label="Search courses"
                />

                {search && (
                    <button
                        type="button"
                        onClick={() => goToSearchRes()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        aria-label="Go to search"
                    >
                        <Search className="h-4 w-4 cursor-pointer" />
                    </button>
                )}
            </div>

            {fetchingCourses ? (
                <GridCourseCardSkeleton />
            ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {courses.map((c) => (
                        <CourseCard
                            key={c.id}
                            id={c.id}
                            bannerImage={c.banner_image}
                            title={c.courseTitle}
                            description={c.description}
                            chaptersCount={c.chapters?.length || 0}
                        />
                    ))}
                </div>
            ) : (
                <EmptyCourse />
            )}

            {loadingMore && <GridCourseCardSkeleton />}
        </div>
    );
};

export default AllCoursesUI;
