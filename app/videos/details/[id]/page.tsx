'use client';

import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import { fetchVideoById } from '@/services/videoService';
import { Video } from '@/types/video';
import {
    doc,
    getDoc,
    increment,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import NotFound from '@/components/VideoDetails/NotFound';
import VideoDetailsUI from '@/components/VideoDetails/UI/VideoDetailsUI';
import VideoDetailsSkeleton from '@/components/skeletons/VideoDetailsSkeleton';

const VideoDetailsPage = () => {
    const params = useParams();
    const { user, loading: authLoading } = useAuthUser();
    const [enrolling, setEnrolling] = useState(false);
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);

    const videoId = typeof params?.id === 'string' ? params.id : '';

    const fetchVideoDetails = useCallback(async () => {
        try {
            setLoading(true);
            const selected = await fetchVideoById(videoId);
            setVideo(selected);
        } catch (err) {
            console.error('Failed to fetch video:', err);
        } finally {
            setLoading(false);
        }
    }, [videoId]);

    useEffect(() => {
        if (!videoId) return;
        fetchVideoDetails();
    }, [fetchVideoDetails, videoId]);

    useEffect(() => {
        if (!user?.email || !video?.id) return;

        const ref = doc(db, 'users', user.email, 'enrollments', video.id);

        const checkEnrollment = async () => {
            try {
                const docSnap = await getDoc(ref);
                setEnrolled(docSnap.exists());
            } catch (err) {
                console.error('Failed to check enrollment:', err);
            }
        };

        checkEnrollment();
    }, [user?.email, video?.id]);

    const handleEnroll = async () => {
        if (!user?.email) {
            toast.warning('Please log in to enroll.');
            return;
        }
        if (!video) return;

        setEnrolling(true);
        try {
            if (!video?.id) {
                toast.error('Video is missing its ID.');
                return;
            }
            const ref = doc(db, 'users', user.email, 'enrollments', video.id);
            await setDoc(ref, {
                videoId: video.id,
                title: video.title,
                thumbnailURL: video.thumbnailURL,
                enrolledAt: serverTimestamp(),
            });

            const videoCollection =
                video.source === 'youtube' ? 'youTubeVideos' : 'videos';
            const videoRef = doc(db, videoCollection, video.id);
            await updateDoc(videoRef, { views: increment(1) }).catch((err) => {
                console.error('Failed to increment video views:', err);
            });

            setVideo((prev) =>
                prev ? { ...prev, views: (prev.views || 0) + 1 } : prev,
            );
            setEnrolled(true);
            toast.success('Successfully enrolled!');
        } catch (err) {
            console.error('Enrollment failed:', err);
            toast.error('Something went wrong while enrolling.');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading || authLoading) return <VideoDetailsSkeleton />;

    if (!video) return <NotFound />;

    return (
        <VideoDetailsUI
            enrolled={enrolled}
            video={video}
            handleEnroll={handleEnroll}
            enrolling={enrolling}
            isAuthenticated={Boolean(user?.email)}
        />
    );
};

export default VideoDetailsPage;
