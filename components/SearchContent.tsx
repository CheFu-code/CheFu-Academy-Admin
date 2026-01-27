'use client';

import Loading from '@/components/Shared/Loading';
import { fetchUploadedVideos } from '@/services/videoService';
import { Video } from '@/types/video';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from './Shared/Header';

const SearchContent = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';

    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFilteredVideos = async () => {
            setLoading(true);
            try {
                const allVideos = await fetchUploadedVideos();
                const filtered = allVideos.filter((v) => v.category === query);
                setVideos(filtered);
            } catch (err) {
                console.error('Failed to fetch videos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredVideos();
    }, [query]);

    if (loading) return <Loading message="Fetching videos..." />;

    return (
        <div>
            <Header
                header="Search results"
                description={`Search results for "${query}"`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {videos.length ? (
                    videos.map((video) => (
                        <div
                            key={video.id}
                            className="border rounded-lg overflow-hidden shadow-md"
                        >
                            {/* Thumbnail with description overlay */}
                            <div className="relative w-full aspect-video">
                                <Image
                                    src={video.thumbnailURL}
                                    alt={video.title}
                                    className="w-full h-full object-cover rounded-t-lg"
                                />

                                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-xl text-sm  select-none">
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
                    <p className="text-muted-foreground flex mt-8 justify-center">
                        No videos available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SearchContent;
