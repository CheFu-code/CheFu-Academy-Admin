'use client';

import Header from '@/components/Shared/Header';
import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton';
import GridCourseCardSkeleton from '@/components/skeletons/GridCourseCardSkeleton';
import { Button } from '@/components/ui/button';
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Course } from '@/types/course';
import { Plus, PlusSquare } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AllCoursesUI = ({
    fetchingCourses,
    courses,
    loadingMore,
    goToCourseView,
}: {
    fetchingCourses: boolean;
    courses: Course[];
    loadingMore: boolean;
    goToCourseView: (courseId: string) => void;
}) => {
    const router = useRouter();
    return (
        <div className="min-h-screen px-4">
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
                        <PlusSquare />
                    </button>
                    {/**TODO implement this on new updates */}
                    {/* <Badge variant={'secondary'} className="cursor-pointer">
                        <Filter className="size-4" />
                        Filter
                    </Badge> */}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {fetchingCourses && courses.length === 0 ? (
                    <GridCourseCardSkeleton />
                ) : courses.length > 0 ? (
                    courses.map((c) => (
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
                                    className="object-fit"
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
                    ))
                ) : (
                    <div className="justify-start text-start">
                        <p className="text-start mt-10 text-gray-500">
                            No courses found.
                        </p>
                        <Button
                            onClick={() =>
                                router.push('/courses/create-course')
                            }
                            className="mt-20 items-center cursor-pointer"
                        >
                            Create course
                            <Plus />
                        </Button>
                    </div>
                )}

                {loadingMore &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <CourseCardSkeleton key={`loading-${i}`} />
                    ))}
            </div>
        </div>
    );
};

export default AllCoursesUI;
