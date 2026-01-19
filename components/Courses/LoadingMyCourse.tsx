import { Loader } from 'lucide-react';
import React from 'react';

const LoadingMyCourse = () => {
    return (
        <div>
            <div>
                <span className="text-3xl font-bold block">My Courses</span>
                <p className="text-xs sm:text-sm text-muted-foreground">
                    Your active learning journey
                </p>
            </div>
            <div className="flex cursor-progress items-center justify-center h-full p-4">
                <p className="font-bold text-base sm:text-lg animate-pulse mr-2">
                    Loading my courses...
                </p>
                <Loader className="animate-spin size-5 text-blue-500" />
            </div>
        </div>
    );
};

export default LoadingMyCourse;
