import { Video } from "@/types/video";
import React from "react";

type OverviewProps = {
    video: Video;
};

const Overview = ({ video }: OverviewProps) => {
    return (
        <div className="flex flex-col gap-6">
            {/* What you'll learn */}
            <div>
                <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-3">
                    What you&apos;ll learn
                </h2>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base md:text-lg text-gray-700">
                    {video.topics?.map((topic, idx) => (
                        <li key={idx}>{topic}</li>
                    ))}
                </ul>
            </div>

            {/* Course Description */}
            <div>
                <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-3">
                    Course Description
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                    {video.description}
                </p>
            </div>
        </div>
    );
};

export default Overview;
