import { MessageSquareIcon } from 'lucide-react';
import React from 'react';

const NoConversationUI = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquareIcon className="w-10 h-10 text-indigo-400 mb-3" />
            <p className="text-base-content/70">No conversations yet</p>
            <p className="text-base-content/60 text-xs mt-1 text-muted-foreground">
                Start a new chat to begin
            </p>
        </div>
    );
};

export default NoConversationUI;
