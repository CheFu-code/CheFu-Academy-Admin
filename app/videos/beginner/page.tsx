import { fetchPublicVideosServer } from '@/services/serverVideoService';
import type { Metadata } from 'next';
import VideoGrid from '../_components/VideoGrid';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
    return {
        title: 'Beginner Videos | CheFu Academy',
        description:
            'Start learning with beginner-friendly CheFu Academy videos.',
    };
}

const BeginnerVideos = async () => {
    const videos = (await fetchPublicVideosServer()).filter(
        video => video.level?.toLowerCase() === 'beginner',
    );

    return (
        <VideoGrid videos={videos} />
    );
};

export default BeginnerVideos;
