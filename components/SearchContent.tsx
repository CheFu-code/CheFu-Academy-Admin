import Image from 'next/image';
import Header from './Shared/Header';
import VideoCardSkeleton from './skeletons/VideoCardSkeleton';
import { Video } from '@/types/video';

const SearchContent = ({
    loading,
    videos,
    goToVidDetails,
    query,
}: {
    loading: boolean;
    videos: Video[];
    goToVidDetails: (videoId?: string | undefined) => void;
    query: string;
}) => {
    if (loading) return <VideoCardSkeleton />;

    return (
        <div>
            <div className="flex justify-between items-center">
                <Header
                    header="Search results"
                    description={`Search results for "${query}"`}
                />
                {videos && (
                    <span className="text-muted-foreground">
                        {videos.length} result{videos.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {videos.length ? (
                    videos.map((video) => (
                        <div
                            onClick={() => goToVidDetails(video.id)}
                            key={video.id}
                            className="border rounded-lg overflow-hidden shadow-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900/40"
                        >
                            {/* Thumbnail with description overlay */}
                            <div className="relative w-full aspect-video">
                                <Image
                                    fill
                                    priority
                                    src={video.thumbnailURL}
                                    alt={video.title}
                                    className="w-full h-full object-cover rounded-t-lg"
                                />
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
                                <p className="text-sm sm:text-base text-gray-500">
                                    Category: {video.category}
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
