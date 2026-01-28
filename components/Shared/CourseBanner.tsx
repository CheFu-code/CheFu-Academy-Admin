'use client';

import Image from 'next/image';
import React from 'react';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';

const CourseBanner = ({
    banner_image,
    courseTitle,
    category,
}: {
    banner_image: string;
    courseTitle: string;
    category: string;
}) => {
    const router = useRouter();
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
        </div>
    );
};

export default CourseBanner;
