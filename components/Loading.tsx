// components/Loading.tsx
'use client';

import { Loader } from 'lucide-react';
import React from 'react';

type LoadingProps = {
    message?: string;
};

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
    return (
        <div className={'flex mt-12 h-screen flex-col items-center space-y-4'}>
            {/* Spinner */}
            <Loader className="size-10 animate-spin" />
            {/* Loading text */}
            <p className="animate-pulse text-lg sm:text-xl font-medium">
                {message}
            </p>
        </div>
    );
};

export default Loading;
