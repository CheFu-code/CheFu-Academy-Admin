import Overview from '@/components/Overview';
import Reviews from '@/components/Reviews/Reviews';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video } from '@/types/video';
import { Timer } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const VideoDetailsUI = ({
    enrolled,
    video,
    handleEnroll,
    enrolling,
}: {
    enrolled: boolean;
    video: Video;
    handleEnroll: () => Promise<void>;
    enrolling: boolean;
}) => {
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
                            priority
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

                <div className="flex justify-between flex-wrap gap-2 sm:gap-4 text-gray-600">
                    <div className="flex gap-4">
                        <p className="text-sm sm:text-base md:text-lg">
                            {video.uploadedAt.toDate().toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-1 text-sm sm:text-base md:text-lg">
                            <Timer className="h-4 w-4" />{' '}
                            {Math.floor(video.duration / 60)}m{' '}
                            {video.duration % 60}s
                        </p>
                    </div>
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
                    <TabsList className="rounded-2xl">
                        <TabsTrigger
                            value="overview"
                            className="px-3 cursor-pointer rounded-lg text-sm sm:text-base md:text-lg"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="px-3 cursor-pointer rounded-lg text-sm sm:text-base md:text-lg"
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

export default VideoDetailsUI;
