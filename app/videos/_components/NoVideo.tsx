import Header from '@/components/Shared/Header';
import React from 'react';

const NoVideo = () => {
    return (
        <div className="flex flex-col h-full">
            <Header header="Videos" description="" />
            <p className="items-center flex mt-12 text-muted-foreground justify-center h-full">
                No videos are currently available.
            </p>
        </div>
    );
};

export default NoVideo;
