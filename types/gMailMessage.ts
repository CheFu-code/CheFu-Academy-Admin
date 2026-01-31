export interface GmailMessage {
    id: string;
    threadId: string;
    snippet: string;
    payload?: {
        headers?: { name: string; value: string }[];
    };
}