'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import { fetchVideos } from '@/services/videoService';
import { Video } from '@/types/video';
import { auth, db } from '@/lib/firebase';
import {
    doc,
    getDoc,
    increment,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { toast } from 'sonner';
import { Timer } from 'lucide-react';

// ✅ Import the components
import Overview from '@/components/Overview';
import Reviews from '@/components/Reviews';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VideoDetailsPage = () => {
    const params = useParams();
    const user = auth.currentUser;
    const [enrolling, setEnrolling] = useState(false);
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>(
        'overview',
    );

    useEffect(() => {
        fetchVideoDetails();
    }, []);

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
            const allVideos = await fetchVideos();
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

    if (loading) return <Loading message="Loading video..." fullScreen />;

    if (!video)
        return (
            <p className="text-center mt-20 text-gray-600">Video not found.</p>
        );

    return (
        <div className="max-w-5xl p-4 flex flex-col gap-6">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl">
                {enrolled ? (
                    <video
                        src={video.videoURL}
                        controls
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <>
                        <Image
                            fill
                            src={video.thumbnailURL}
                            alt={video.title}
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gray-400/90 flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6">
                            <p className=" font-semibold text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                                Enroll to watch this video
                            </p>
                            <Button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className=" cursor-pointer  bg-green-500 hover:bg-green-700 text-white transition disabled:opacity-50 text-sm sm:text-base md:text-lg"
                            >
                                {enrolling ? 'Enrolling...' : 'Enroll Now'}
                            </Button>
                        </div>
                    </>
                )}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black bg-opacity-60 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm md:text-base">
                    {video.category}
                </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2 sm:gap-3">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                    {video.title}
                </h1>
                <h3 className="text-sm sm:text-base md:text-lg">
                    by {video.uploadedBy}
                </h3>

                <div className="flex flex-wrap gap-2 sm:gap-4 text-gray-600">
                    <p className="text-sm sm:text-base md:text-lg">
                        {video.uploadedAt.toDate().toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-1 text-sm sm:text-base md:text-lg">
                        <Timer className="h-4 w-4" />{' '}
                        {Math.floor(video.duration / 60)}m {video.duration % 60}
                        s
                    </p>
                    <p className="text-sm sm:text-base md:text-lg">
                        Views: {video.views || 0}
                    </p>
                </div>

                {/* Info Boxes */}
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Level:</CardTitle>
                            <CardDescription>
                                {video.level.charAt(0).toUpperCase() +
                                    video.level.slice(1)}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Language</CardTitle>
                            <CardDescription>English</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="flex flex-col gap-4">
                    {/* Tab headers */}
                    <TabsList className="bg-gray-400/50 rounded-2xl p-1 gap-1">
                        <TabsTrigger
                            value="overview"
                            className="px-3 py-1 cursor-pointer rounded-lg text-sm sm:text-base md:text-lg"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="px-3 py-1 cursor-pointer rounded-lg text-sm sm:text-base md:text-lg"
                        >
                            Reviews
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab content */}
                    <TabsContent value="overview" className="mt-4">
                        <Overview video={video} />
                    </TabsContent>
                    <TabsContent value="reviews" className="mt-4">
                        <Reviews video={video} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default VideoDetailsPage;
