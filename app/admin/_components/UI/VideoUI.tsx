import Header from '@/components/Shared/Header';
import { Video } from '@/types/video';
import Image from 'next/image';
import React from 'react';

const VideoUI = ({
    videos,
    goToVidDetails,
    goToSearch,
}: {
    videos: Video[];
    goToVidDetails: (videoId?: string | undefined) => void;
    goToSearch: (category: string) => void;
}) => {
    return (
        <>
            <Header header="Video" description="" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.length ? (
                    videos.map((video) => (
                        <div
                            key={video.id}
                            className="border border-gray-400 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700/20 cursor-pointer overflow-hidden shadow-md"
                            onClick={() => goToVidDetails(video.id)}
                        >
                            {/* Thumbnail with description overlay */}
                            <div className="relative w-full aspect-video">
                                <Image
                                    fill
                                    priority
                                    src={video.thumbnailURL}
                                    alt={video.title}
                                    className="w-full border-b border-gray-400 dark:border-gray-700 h-full object-contain bg-gray-500/70 rounded-t-lg"
                                />

                                <div
                                    onClick={() => goToSearch(video.category)}
                                    className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-xl text-sm cursor-pointer select-none"
                                >
                                    {video.category}
                                </div>
                            </div>

                            {/* Video info */}
                            <div className="p-4 flex flex-col gap-0.5">
                                <h2 className="font-semibold text-lg sm:text-xl truncate">
                                    {video.title}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500">
                                    Level:{' '}
                                    {video.level.charAt(0).toUpperCase() +
                                        video.level.slice(1)}
                                </p>
                                <p className="text-sm sm:text-base text-gray-500">
                                    Duration: {Math.floor(video.duration / 60)}m{' '}
                                    {video.duration % 60}s
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No videos available.</p>
                )}
            </div>
        </>
    );
};

export default VideoUI;
