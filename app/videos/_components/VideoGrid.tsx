import { Video } from '@/types/video';
import Image from 'next/image';
import Link from 'next/link';
import NoVideo from './NoVideo';

type VideoGridProps = {
    videos: Video[];
};

function formatDuration(duration = 0) {
    if (!duration) return 'YouTube video';
    return `${Math.floor(duration / 60)}m ${duration % 60}s`;
}

function formatLevel(level?: string) {
    if (!level) return 'Unknown';
    return level.charAt(0).toUpperCase() + level.slice(1);
}

export default function VideoGrid({ videos }: VideoGridProps) {
    if (!videos.length) {
        return <NoVideo />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {videos.map(video => (
                <VideoCard key={video.id || video.videoURL} video={video} />
            ))}
        </div>
    );
}

function VideoCard({ video }: { video: Video }) {
    const videoHref = video.id ? `/videos/details/${video.id}` : video.videoURL;
    const externalVideo = !video.id;

    return (
        <article className="border rounded-lg overflow-hidden shadow-md">
            <div className="relative w-full aspect-video">
                <Link
                    href={videoHref}
                    target={externalVideo ? '_blank' : undefined}
                    rel={externalVideo ? 'noopener noreferrer' : undefined}
                >
                    <Image
                        fill
                        src={video.thumbnailURL}
                        alt={video.title}
                        className="w-full h-full object-contain bg-gray-500/70 rounded-t-lg"
                    />
                </Link>

                <Link
                    href={`/videos/search?query=${encodeURIComponent(video.category)}`}
                    className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-xl text-sm"
                >
                    {video.category}
                </Link>
            </div>

            <div className="p-4 flex flex-col gap-0.5">
                <h2 className="font-semibold text-lg sm:text-xl truncate">
                    <Link
                        href={videoHref}
                        target={externalVideo ? '_blank' : undefined}
                        rel={externalVideo ? 'noopener noreferrer' : undefined}
                    >
                        {video.title}
                    </Link>
                </h2>
                <p className="text-sm sm:text-base text-gray-500">
                    Level: {formatLevel(video.level)}
                </p>
                <p className="text-sm sm:text-base text-gray-500">
                    {video.source === 'youtube' ? 'Source' : 'Duration'}:{' '}
                    {formatDuration(video.duration)}
                </p>
            </div>
        </article>
    );
}
