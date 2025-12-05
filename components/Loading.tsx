// components/Loading.tsx
"use client";

import React from "react";

type LoadingProps = {
    message?: string;
    fullScreen?: boolean; // optional: center vertically if true
};

const Loading: React.FC<LoadingProps> = ({
    message = "Loading...",
    fullScreen = false,
}) => {
    return (
        <div
            className={`${
                fullScreen
                    ? "flex items-center justify-center h-screen"
                    : "flex"
            } flex-col items-center space-y-4`}
        >
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            {/* Loading text */}
            <p className="animate-pulse text-lg sm:text-xl font-medium">
                {message}
            </p>
        </div>
    );
};

export default Loading;
