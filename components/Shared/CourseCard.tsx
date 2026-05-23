import Image from 'next/image';
import React from 'react';
import { Badge } from '../ui/badge';
import { CardDescription, CardTitle } from '../ui/card';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

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
    return (
        <Link
            href={`/courses/course-view/${id}`}
            className="group block h-full overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl"
        >
            <div className="relative h-36 w-full overflow-hidden sm:h-44">
                <Image
                    alt={title}
                    src={bannerImage}
                    priority
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur">
                    <BookOpen className="mr-1 h-3.5 w-3.5" />
                    {chaptersCount === 1
                        ? '1 Chapter'
                        : `${chaptersCount} Chapters`}
                </Badge>
                <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-cyan-100">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI learning path
                    </div>
                    <CardTitle className="mt-1 line-clamp-2 text-lg font-semibold text-white">
                        {title}
                    </CardTitle>
                </div>
            </div>

            <div className="flex min-h-36 flex-col justify-between p-4">
                <CardDescription className="line-clamp-3 text-sm leading-6">
                    {description || 'No description available.'}
                </CardDescription>

                <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                        Start learning
                    </span>
                    <span className="flex size-9 items-center justify-center rounded-full bg-cyan-500 text-white transition group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
