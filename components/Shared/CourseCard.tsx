import Image from 'next/image';
import React from 'react';
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { useRouter } from 'next/navigation';

type CourseCardProps = {
    id: string;
    bannerImage: string;
    title: string;
    description?: string;
    chaptersCount: number;
};

const CourseCard = ({
    id,
    bannerImage,
    title,
    description,
    chaptersCount,
}: CourseCardProps) => {
    const router = useRouter();
    const handleClick = () => {
        router.replace(`/courses/course-view/${id}`);
    };
    return (
        <div
            onClick={handleClick}
            className="max-w-full hover:shadow-lg hover:bg-gray-100/10 transition-shadow duration-200 rounded-xl cursor-pointer border border-muted-foreground"
        >
            {/* Banner */}
            <div className="relative w-full h-32 sm:h-40 overflow-hidden rounded-t-xl">
                <Image
                    alt="Banner"
                    src={bannerImage}
                    priority
                    fill
                    className="object-cover"
                />
            </div>

            <CardHeader>
                <CardTitle className="text-base sm:text-lg md:text-xl lg:text-xl mt-4 font-semibold truncate">
                    {title}
                </CardTitle>

                {/* Description hover */}
                <div className="relative group">
                    <CardDescription className="text-sm sm:text-base  line-clamp-2 transition-all duration-300">
                        {description || 'No description available.'}
                    </CardDescription>

                    {description && (
                        <div className="absolute left-0 top-full mt-2 bg-gray-300/95 dark:bg-gray-800/95 p-2 rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50">
                            <p className="whitespace-pre-wrap text-sm">
                                {description}
                            </p>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm sm:text-base font-semibold mt-2 mb-2">
                    {chaptersCount === 1
                        ? '1 Chapter'
                        : `${chaptersCount} Chapters`}
                </p>
            </CardContent>
        </div>
    );
};

export default CourseCard;
