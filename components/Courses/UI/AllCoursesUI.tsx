'use client';

import Header from '@/components/Shared/Header';
import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton';
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useCourseNavigation } from '@/hooks/useCourseNavigation';
import { Course } from '@/types/course';
import { PlusSquare } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EmptyCourse from './EmptyCourse';
import GridCourseCardSkeleton from '@/components/skeletons/GridCourseCardSkeleton';

const AllCoursesUI = ({
    fetchingCourses,
    courses,
    loadingMore,
}: {
    fetchingCourses: boolean;
    courses: Course[];
    loadingMore: boolean;
}) => {
    const router = useRouter();
    const { goToCourseView } = useCourseNavigation();

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

            {fetchingCourses ? (
                <GridCourseCardSkeleton />
            ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {courses.map((c) => (
                        <div
                            key={c.id}
                            onClick={() => goToCourseView(c.id)}
                            className="hover:shadow-lg hover:bg-gray-100/10 transition-shadow duration-200 rounded-xl cursor-pointer border border-muted-foreground"
                        >
                            <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
                                <Image
                                    alt="Banner"
                                    src={c.banner_image}
                                    priority
                                    fill
                                    className="object-cover"
                                    sizes="w-full h-40"
                                />
                            </div>

                            <CardHeader>
                                <CardTitle className="text-lg mt-4 font-semibold truncate">
                                    {c.courseTitle}
                                </CardTitle>
                                <div className="relative group">
                                    <CardDescription className="line-clamp-2 transition-all duration-300">
                                        {c.description ||
                                            'No description available.'}
                                    </CardDescription>

                                    <div className="absolute left-0 top-0 w-full mt-4 bg-gray-300/95 dark:bg-gray-800/95 p-2 rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                                        <p className="whitespace-pre-wrap">
                                            {c.description ||
                                                'No description available.'}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold mb-2 mt-2">
                                    {c.chapters.length > 1
                                        ? `${c.chapters.length} Chapters`
                                        : `${c.chapters.length} Chapter`}
                                </p>
                            </CardContent>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyCourse />
            )}

            {loadingMore &&
                Array.from({ length: 3 }).map((_, i) => (
                    <CourseCardSkeleton key={`loading-${i}`} />
                ))}
        </div>
    );
};

export default AllCoursesUI;
