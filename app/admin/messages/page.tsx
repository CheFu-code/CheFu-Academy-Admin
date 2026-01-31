'use client';

import { useAuthUser } from '@/hooks/useAuthUser';
import { useSearchParams } from 'next/navigation';
import React, { useRef, useState } from 'react';
import MessagesUI from '../_components/UI/MessagesUI';

const MessagePage = () => {
    const { user } = useAuthUser();
    const [chats, setChats] = React.useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [chatsLoading, setChatsLoading] = React.useState(false);
    const [messagesLoading, setMessagesLoading] = React.useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const messagesEndRef = useRef(null);

    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
    };
    return (
        <MessagesUI
            chatsLoading={chatsLoading}
            chats={chats}
            messageInput={messageInput}
            messagesLoading={messagesLoading}
            messages={[]}
            handleSend={handleSend}
            user={user}
        />
    );
};

export default MessagePage;
