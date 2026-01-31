import { MessageSquareIcon } from 'lucide-react';
import React from 'react';

const NoMessageUI = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-base-300/40 flex items-center justify-center mb-4">
                <MessageSquareIcon className="w-8 h-8 text-base-content/20" />
            </div>
            <p className="text-base-content/70">No messages yet</p>
            <p className="text-base-content/60 text-sm mt-1">
                Send a message to start the conversation
            </p>
        </div>
    );
};

export default NoMessageUI;
