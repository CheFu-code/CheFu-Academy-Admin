import {
    fetchPublicVideosServer,
    fetchYouTubeVideosServer,
} from '@/services/serverVideoService';
import type { Metadata } from 'next';
import VideoGrid from '../_components/VideoGrid';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
    return {
        title: 'All Videos | CheFu Academy',
        description:
            'Browse all CheFu Academy learning videos by category, level, and duration.',
    };
}

const AllVideos = async () => {
    const [uploadedVideos, youtubeVideos] = await Promise.all([
        fetchPublicVideosServer(),
        fetchYouTubeVideosServer(),
    ]);
    const videos = [...uploadedVideos, ...youtubeVideos];

    return (
        <VideoGrid videos={videos} />
    );
};

export default AllVideos;
