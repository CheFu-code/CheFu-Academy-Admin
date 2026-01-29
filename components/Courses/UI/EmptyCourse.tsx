'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EmptyCourse = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center w-full h-[60vh] mt-8 text-center gap-6  rounded-xl shadow-lg p-8">
            <p className="text-gray-400 text-lg sm:text-xl font-semibold animate-fadeIn">
                No courses found.
            </p>

            <Button
                onClick={() => router.push('/courses/create-course')}
                className="inline-flex items-center gap-3 px-8 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full shadow-md hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-300"
            >
                <Plus className="w-5 h-5" />
                Create Course
            </Button>
        </div>
    );
};

export default EmptyCourse;
