'use client';

import { downloadCoursePDF_Office } from '@/helpers/downloadCourse';
import { Course } from '@/types/course';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const CourseBanner = ({
    banner_image,
    courseTitle,
    category,
    course,
    router,
}: {
    banner_image: string;
    courseTitle: string;
    category: string;
    course: Course;
    router: ReturnType<typeof import('next/navigation').useRouter>;
}) => {
    const goToSearch = (category: string) => {
        router.push(`/courses/search?query=${encodeURIComponent(category)}`);
    };

    return (
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
            <Image
                fill
                priority
                src={banner_image}
                alt={courseTitle}
                className="w-full h-full object-cover"
            />
            {category && (
                <Badge
                    onClick={() => goToSearch(category)}
                    className="absolute cursor-pointer top-3 left-3 hover:bg-green-700 bg-green-600 text-white px-2 py-1"
                >
                    {category}
                </Badge>
            )}
            <div className="absolute right-3 flex items-center">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={async () =>
                                await downloadCoursePDF_Office(course)
                            }
                            className="p-2 items-center justify-center cursor-pointer rounded-xl bg-green-500 text-white hover:bg-gray-200/30"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>Download Course</TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
};

export default CourseBanner;
