import { Video } from '@/types/video';
import { BookOpenCheck, CircleCheck, FileText } from 'lucide-react';
import React from 'react';

type OverviewProps = {
    video: Video;
};

const Overview = ({ video }: OverviewProps) => {
    const topics = video.topics?.filter(Boolean) ?? [];

    return (
        <div className="flex flex-col gap-8">
            <section>
                <div className="mb-4 flex items-center gap-2">
                    <BookOpenCheck className="size-5 text-emerald-600" />
                    <h2 className="text-lg font-semibold tracking-tight">
                        What you&apos;ll learn
                    </h2>
                </div>
                {topics.length > 0 ? (
                    <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                        {topics.map((topic, idx) => (
                            <li key={`${topic}-${idx}`} className="flex gap-2">
                                <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                <span>{topic}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm leading-6 text-muted-foreground">
                        This lesson is ready to watch. Use the video player above
                        to follow the session at your own pace.
                    </p>
                )}
            </section>

            <section>
                <div className="mb-4 flex items-center gap-2">
                    <FileText className="size-5 text-emerald-600" />
                    <h2 className="text-lg font-semibold tracking-tight">
                        About this video
                    </h2>
                </div>
                <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                    {video.description ||
                        'A curated CheFu Academy lesson selected to support your learning path.'}
                </p>
            </section>
        </div>
    );
};

export default Overview;
