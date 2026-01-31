import { User } from '@/types/user';
import { Loader } from 'lucide-react';
import Header from '../Message/Header';
import NoChatSelectedUI from '../Message/NoChatSelectedUI';
import NoConversationUI from '../Message/NoConversationUI';

const MessagesUI = ({
    chatsLoading,
    chats,
    messageInput,
    messagesLoading,
    messages,
    handleSend,
    user,
}: {
    chatsLoading: boolean;
    chats: never[];
    messageInput: string;
    messagesLoading: boolean;
    messages: never[];
    handleSend: (e: React.FormEvent<HTMLFormElement>) => void;
    user: User | null;
}) => {
    return (
        <div className="h-screen bg-background flex">
            {/** Sidebar */}
            <div className="w-80 border-r border-gray-300/20 flex flex-col bg-background">
                {/* <Header /> */}

                {/** Message List */}
                <div className="flex-1 overflow-y-auto">
                    {chatsLoading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader className="text-indigo-400 animate-spin" />
                        </div>
                    )}

                    {chats.length === 0 && !chatsLoading && (
                        <NoConversationUI />
                    )}
                </div>
            </div>

            {/* main chat area */}
            <div className="flex-1 flex flex-col">
                <NoChatSelectedUI />
            </div>
        </div>
    );
};

export default MessagesUI;
