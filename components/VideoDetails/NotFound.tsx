import { VideoOff } from 'lucide-react';
import React from 'react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <VideoOff className="mt-5 size-30 text-muted-foreground" />
            <p className="mt-10 text-muted-foreground">
                Sorry! Video not found
            </p>
        </div>
    );
};

export default NotFound;
