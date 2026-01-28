'use client';

import Loading from '@/components/Shared/Loading';
import { auth, db } from '@/lib/firebase';
import { fetchUploadedVideos } from '@/services/videoService';
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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// ✅ Import the components
import NotFound from '@/components/VideoDetails/NotFound';
import VideoDetailsUI from '@/components/VideoDetails/UI/VideoDetailsUI';

const VideoDetailsPage = () => {
    const params = useParams();
    const user = auth.currentUser;
    const [enrolling, setEnrolling] = useState(false);
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState(false);

    useEffect(() => {
        if (!params?.id) return;
        fetchVideoDetails();
    }, [params?.id]);

    useEffect(() => {
        if (!user?.email || !video?.id) return;

        const ref = doc(db, 'users', user.email, 'enrollments', video.id);

        const checkEnrollment = async () => {
            try {
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) setEnrolled(true);
            } catch (err) {
                console.error('Failed to check enrollment:', err);
            }
        };

        checkEnrollment();
    }, [user?.email, video?.id]);

    const fetchVideoDetails = async () => {
        try {
            setLoading(true);
            const allVideos = await fetchUploadedVideos();
            const selected = allVideos.find((v) => v.id === params?.id) || null;
            setVideo(selected);
        } catch (err) {
            console.error('Failed to fetch video:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            toast.warning('Please log in to enroll.');
            return;
        }
        if (!video) return;

        setEnrolling(true);
        try {
            if (!user?.email || !video?.id) {
                console.error('User email or video ID is missing');
                return;
            }
            const ref = doc(db, 'users', user.email, 'enrollments', video.id);
            await setDoc(ref, {
                videoId: video.id,
                title: video.title,
                thumbnailURL: video.thumbnailURL,
                enrolledAt: serverTimestamp(),
            });

            const videoRef = doc(db, 'videos', video.id);
            await updateDoc(videoRef, { views: increment(1) });

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

    if (loading) return <Loading message="Loading video..." />;

    if (!video) return <NotFound />;

    return (
        <VideoDetailsUI
            enrolled={enrolled}
            video={video}
            handleEnroll={handleEnroll}
            enrolling={enrolling}
        />
    );
};

export default VideoDetailsPage;
