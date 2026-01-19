'use client';

import React from 'react';
import { BookOpen, Plus } from 'lucide-react'; // Icon from lucide-react
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const NoCourseYet = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[300px] p-6 space-y-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
            {/* Header */}
            <div className="text-center">
                <span className="text-3xl sm:text-4xl font-extrabold block text-gray-900 dark:text-gray-100">
                    My Courses
                </span>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                    Your active learning journey
                </p>
            </div>

            {/* Icon & Message */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600" />
                <p className="font-semibold text-base sm:text-lg text-gray-700 dark:text-gray-300 text-center max-w-xs">
                    You haven’t enrolled in any courses yet — start your
                    learning journey today!
                </p>
            </div>

            {/* Optional CTA */}
            <Button
                onClick={() => router.push('/courses/create-course')}
                className="mt-4 py-2 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition"
            >
                <Plus />
                Create course
            </Button>
            <Button
                onClick={() => router.push('/courses')}
                variant={'ghost'}
                className="mt-4 px-6 py-2  text-blue-500 rounded-lg cursor-pointer transition"
            >
                Browse Courses
            </Button>
        </div>
    );
};

export default NoCourseYet;
