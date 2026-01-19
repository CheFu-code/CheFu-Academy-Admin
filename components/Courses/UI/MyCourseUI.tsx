import Header from '@/components/Shared/Header';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { imageAssets } from '@/constants/Options';
import { Course } from '@/types/course';
import Image from 'next/image';
import React from 'react';

const MyCourseUI = ({
    courses,
    handleClick,
}: {
    courses: Course[];
    handleClick: (id: string) => void;
}) => {
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
                            <div
                                key={course.id}
                                onClick={() => handleClick(course.id)}
                                className={` cursor-pointer hover:bg-gray-100/10 rounded-xl border transition ${
                                    completedChapters === totalChapters
                                        ? 'border-green-500'
                                        : 'border-muted-foreground'
                                }`}
                            >
                                {course.banner_image && (
                                    <div className="relative w-full h-24 sm:h-32 md:h-36 overflow-hidden rounded-t-md">
                                        <Image
                                            fill
                                            priority
                                            src={
                                                imageAssets[course.banner_image]
                                            }
                                            alt={course.courseTitle}
                                            className="w-full h-full object-cover"
                                        />
                                        {course.category && (
                                            <Badge
                                                variant="secondary"
                                                className="absolute ml-2 mt-2 top-1 left-1 text-[10px] sm:text-xs px-1 py-0.5 shadow-md bg-green-600"
                                            >
                                                <span className="text-white">
                                                    {course.category}
                                                </span>
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                <CardHeader className="space-y-1 px-3 pt-2">
                                    <CardTitle className="text-sm sm:text-base truncate">
                                        {course.courseTitle}
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground">
                                        {totalChapters} chapter
                                        {totalChapters !== 1 ? 's' : ''}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-2 px-3 pb-3 flex flex-col flex-1 justify-end">
                                    <Progress
                                        value={progress}
                                        className="h-1.5 sm:h-2 rounded-full"
                                    />
                                    <div className="flex-row flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground">
                                            {completedChapters}/{totalChapters}{' '}
                                            completed
                                        </p>
                                        {completedChapters ===
                                            totalChapters && (
                                            <Badge
                                                variant="secondary"
                                                className=" bg-green-600 text-white"
                                            >
                                                Completed
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </>
    );
};

export default MyCourseUI;
