'use client';

import SearchContent from '@/components/SearchContent';
import VideoCardSkeleton from '@/components/skeletons/VideoCardSkeleton';
import { fetchUploadedVideos } from '@/services/videoService';
import { Video } from '@/types/video';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const router = useRouter();
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

    const goToVidDetails = (videoId?: string) => {
        if (!videoId) return;
        router.push(`/videos/details/${videoId}`);
    };

    return (
        <Suspense fallback={<VideoCardSkeleton />}>
            <SearchContent
                loading={loading}
                videos={videos}
                goToVidDetails={goToVidDetails}
                query={query}
            />
        </Suspense>
    );
}
