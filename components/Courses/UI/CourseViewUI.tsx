import Image from 'next/image';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Course } from '@/types/course';

const CourseViewUI = ({
    course,
    completedChapters,
    totalChapters,
    progress,
    handleChapterClick,
    completedChaptersState,
}: {
    course: Course;
    completedChapters: number;
    totalChapters: number;
    progress: number;
    handleChapterClick: (idx: number) => Promise<void>;
    completedChaptersState: string[];
}) => {
    return (
        <div className="p-4 max-w-5xl mx-auto space-y-6">
            {/* Course Banner */}
            {course.banner_image && (
                <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
                    <Image
                        fill
                        priority
                        src={course.banner_image}
                        alt={course.courseTitle}
                        className="w-full h-full object-cover"
                    />
                    {course.category && (
                        <Badge className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1">
                            {course.category}
                        </Badge>
                    )}
                </div>
            )}

            {/* Course Title & Description */}
            <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    {course.courseTitle}
                </h1>
                <div className="text-sm text-muted-foreground flex-row items-center flex gap-2">
                    <BookOpen size={17} />
                    <p>{course.chapters.length} chapters</p>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                    {course.description}
                </p>
            </div>

            {/* Progress */}
            <Card className={'py-4'}>
                <CardHeader className="space-y-2">
                    <CardTitle>Progress</CardTitle>
                    <CardDescription>
                        {completedChapters}/{totalChapters} chapters completed
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Progress value={progress} className="h-2 rounded-full" />
                </CardContent>
            </Card>

            {/* Chapters List */}
            <div className="space-y-3">
                <h2 className="text-xl font-semibold">Chapters</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {course.chapters.map((chapter, idx) => {
                        const isCompleted = completedChaptersState.includes(
                            idx.toString(),
                        );

                        return (
                            <Card
                                key={idx}
                                onClick={() => handleChapterClick(idx)}
                                className={`p-3 cursor-pointer hover:bg-muted/50 transition ${
                                    isCompleted ? 'border-green-500' : ''
                                }`}
                            >
                                <CardTitle className="text-sm sm:text-base">
                                    {chapter.chapterName}
                                </CardTitle>
                                <CardDescription className="text-xs text-muted-foreground line-clamp-3">
                                    {chapter.content[0]?.explain as string}
                                </CardDescription>
                                {isCompleted && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-600 text-white"
                                    >
                                        Completed
                                    </Badge>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CourseViewUI;
