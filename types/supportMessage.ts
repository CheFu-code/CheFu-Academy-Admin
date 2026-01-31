import { Timestamp } from 'firebase/firestore';

/* -------------------- Chat Typing State -------------------- */
export type ChatTypingStatus = {
    user: boolean;
    admin: boolean;
};

/* -------------------- Support Chat Document -------------------- */
export type SupportChat = {
    userId: string;
    userName: string;
    userEmail: string;

    status: 'open' | 'closed';

    lastMessage: string;
    lastMessageAt: Timestamp;

    createdAt: Timestamp;
    updatedAt: Timestamp;

    userOnline: boolean;
    adminOnline: boolean;

    typing: ChatTypingStatus;
};

/* -------------------- Message Document -------------------- */
export type SupportMessage = {
    sender: 'user' | 'admin';
    text: string;
    createdAt: Timestamp;
    read: boolean;
};
