import { imageAssets } from '@/constants/Options';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Badge } from '../ui/badge';
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';

const HomeCourseCard = ({
    id,
    banner_image,
    courseTitle,
    category,
    totalChapters,
    completedChapters,
    progress,
}: {
    id: string;
    banner_image: string;
    courseTitle: string;
    category: string;
    totalChapters: number;
    completedChapters: number;
    progress: number;
}) => {
    const router = useRouter();
    const goToSearch = (category: string) => {
        router.push(`/courses/search?query=${encodeURIComponent(category)}`);
    };
    return (
        <div
            key={id}
            onClick={() => router.push(`/courses/my-courses/course-view/${id}`)}
            className={` cursor-pointer hover:bg-gray-800/40 rounded-2xl border transition ${
                completedChapters === totalChapters
                    ? 'border-green-500'
                    : 'border-muted-foreground'
            }`}
        >
            {banner_image && (
                <div className="relative w-full h-24 sm:h-32 md:h-36 overflow-hidden rounded-t-md">
                    <Image
                        fill
                        priority
                        src={imageAssets[banner_image]}
                        alt={courseTitle}
                        className="w-full h-full object-cover"
                    />
                    {category && (
                        <Badge
                            onClick={(e) => {
                                e.stopPropagation(); // ✅ stop parent click
                                goToSearch(category);
                            }}
                            variant="secondary"
                            className="absolute cursor-pointer ml-2 mt-2  top-1 left-1 text-[10px] sm:text-xs px-1 py-0.5 shadow-md bg-green-600"
                        >
                            <span className="text-white">{category}</span>
                        </Badge>
                    )}
                </div>
            )}

            <CardHeader className="space-y-1 px-3 pt-2">
                <CardTitle className="text-sm sm:text-base truncate">
                    {courseTitle}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    {totalChapters} chapter
                    {totalChapters !== 1 ? 's' : ''}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 px-3 pb-3 pt-1 flex flex-col flex-1 justify-end">
                <Progress
                    value={progress}
                    className="h-1.5 sm:h-2 rounded-full"
                />
                <div className="flex-row flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                        {completedChapters}/{totalChapters} completed
                    </p>
                    {completedChapters === totalChapters && (
                        <Badge className=" bg-green-600 text-white">
                            Completed
                        </Badge>
                    )}
                </div>
            </CardContent>
        </div>
    );
};

export default HomeCourseCard;
