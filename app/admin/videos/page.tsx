'use client';

import VideoCardSkeleton from '@/components/skeletons/VideoCardSkeleton';
import { fetchUploadedVideos } from '@/services/videoService';
import { Video } from '@/types/video';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import VideoUI from '../_components/UI/VideoUI';

const VideosCreationPage = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchAllVideos();
    }, []);

    const fetchAllVideos = async () => {
        try {
            setLoading(true);
            const fetched = await fetchUploadedVideos();
            setVideos(fetched);
        } catch (err) {
            console.error('Failed to fetch videos:', err);
        } finally {
            setLoading(false);
        }
    };

    const goToSearch = (category: string) => {
        router.push(`/videos/search?query=${encodeURIComponent(category)}`);
    };

    const goToVidDetails = (videoId?: string) => {
        if (!videoId) return;
        router.push(`/videos/details/${videoId}`);
    };

    if (loading) return <VideoCardSkeleton />;

    return (
        <VideoUI
            videos={videos}
            goToVidDetails={goToVidDetails}
            goToSearch={goToSearch}
        />
    );
};

export default VideosCreationPage;
