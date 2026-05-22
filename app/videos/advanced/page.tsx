import { fetchPublicVideosServer } from '@/services/serverVideoService';
import type { Metadata } from 'next';
import VideoGrid from '../_components/VideoGrid';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
    return {
        title: 'Advanced Videos | CheFu Academy',
        description:
            'Go deeper with advanced CheFu Academy videos for experienced learners.',
    };
}

const AdvancedVideos = async () => {
    const videos = (await fetchPublicVideosServer()).filter(
        video => video.level?.toLowerCase() === 'advance',
    );

    return (
        <VideoGrid videos={videos} />
    );
};

export default AdvancedVideos;
