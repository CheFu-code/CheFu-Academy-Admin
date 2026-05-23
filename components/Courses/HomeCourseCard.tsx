import { imageAssets } from '@/constants/Options';
import { ArrowRight, BookOpenCheck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Badge } from '../ui/badge';
import { CardDescription, CardTitle } from '../ui/card';
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
    const imageSrc = imageAssets[banner_image] || banner_image;

    const goToSearch = (courseCategory: string) => {
        router.push(`/courses/search?query=${encodeURIComponent(courseCategory)}`);
    };

    return (
        <div
            key={id}
            onClick={() => router.push(`/courses/my-courses/course-view/${id}`)}
            className={`group cursor-pointer overflow-hidden rounded-xl border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl ${
                completedChapters === totalChapters
                    ? 'border-green-500/70'
                    : 'border-border/70'
            }`}
        >
            {banner_image && (
                <div className="relative h-36 w-full overflow-hidden sm:h-40">
                    <Image
                        fill
                        priority
                        src={imageSrc}
                        alt={courseTitle}
                        className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    {category && (
                        <Badge
                            onClick={(event) => {
                                event.stopPropagation();
                                goToSearch(category);
                            }}
                            variant="secondary"
                            className="absolute left-3 top-3 cursor-pointer bg-background/90 text-foreground shadow-md backdrop-blur hover:bg-cyan-600 hover:text-white"
                        >
                            {category}
                        </Badge>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                        <CardTitle className="line-clamp-2 text-lg font-semibold text-white">
                            {courseTitle}
                        </CardTitle>
                    </div>
                </div>
            )}

            <div className="space-y-4 p-4">
                <CardDescription className="flex items-center gap-2 text-sm">
                    <BookOpenCheck className="h-4 w-4 text-cyan-500" />
                    {totalChapters} chapter{totalChapters !== 1 ? 's' : ''}
                </CardDescription>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {completedChapters}/{totalChapters} completed
                        </span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5 rounded-full sm:h-2" />
                </div>

                <div className="flex items-center justify-between">
                    {completedChapters === totalChapters ? (
                        <Badge className="bg-green-600 text-white">Completed</Badge>
                    ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                            Continue
                        </span>
                    )}
                    <span className="flex size-9 items-center justify-center rounded-full bg-cyan-500 text-white transition group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HomeCourseCard;
