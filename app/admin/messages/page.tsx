'use client';

import { useAuthUser } from '@/hooks/useAuthUser';
import React from 'react';
import MessagesUI from '../_components/UI/MessagesUI';

const MessagePage = () => {
    const { user } = useAuthUser();
    const [chats] = React.useState([]);
    const [chatsLoading] = React.useState(false);

    return (
        <MessagesUI
            chatsLoading={chatsLoading}
            chats={chats}
            user={user}
        />
    );
};

export default MessagePage;
