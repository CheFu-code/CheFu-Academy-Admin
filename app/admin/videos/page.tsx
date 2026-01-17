"use client";

import Loading from "@/components/Loading";
import { fetchVideos } from "@/services/videoService";
import { Video } from "@/types/video";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      const fetched = await fetchVideos();
      setVideos(fetched);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
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

  if (loading) return <Loading message="Loading videos..." fullScreen={true} />;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {videos.length ? (
          videos.map((video) => (
            <div
              key={video.id}
              className="border rounded-lg cursor-pointer overflow-hidden shadow-md"
              onClick={() => goToVidDetails(video.id)}
            >
              {/* Thumbnail with description overlay */}
              <div className="relative w-full aspect-video">
                <Image
                  src={video.thumbnailURL}
                  alt={video.title}
                  className="w-full h-full object-contain bg-gray-500/70 rounded-t-lg"
                />

                <div
                  onClick={() => goToSearch(video.category)}
                  className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-xl text-sm cursor-pointer select-none"
                >
                  {video.category}
                </div>
              </div>

              {/* Video info */}
              <div className="p-4 flex flex-col gap-0.5">
                <h2 className="font-semibold text-lg sm:text-xl truncate">
                  {video.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-500">
                  Level:{" "}
                  {video.level.charAt(0).toUpperCase() + video.level.slice(1)}
                </p>
                <p className="text-sm sm:text-base text-gray-500">
                  Duration: {Math.floor(video.duration / 60)}m{" "}
                  {video.duration % 60}s
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No videos available.</p>
        )}
      </div>
    </>
  );
};

export default VideosCreationPage;
