'use client';

import TicketDetailUI from '@/app/admin/_components/UI/Tickets/TicketDetailUI';
import { now } from '@/constants/Data';
import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import { TicketStatus } from '@/types/supportTicket';
import { autosize, charLimit, Props } from '@/utils/ticketDetailsUtils';
import { computeOverdue } from '@/utils/ticketSLA';
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function TicketDetailClient({ ticket, action }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuthUser();
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const isReplyMode = useMemo(
        () => (action ?? searchParams.get('action')) === 'reply',
        [action, searchParams],
    );

    // Focus textarea & autosize on open
    useEffect(() => {
        if (isReplyMode && textAreaRef.current) {
            textAreaRef.current.focus();
            autosize(textAreaRef.current);
        }
    }, [isReplyMode]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReplyText(e.target.value);
        if (textAreaRef.current) autosize(textAreaRef.current);
    };

    const getBasePath = useCallback(
        () => `/admin/support-tickets/reply/${ticket.id}`,
        [ticket.id],
    );

    const openReply = () => {
        router.replace(`${getBasePath()}?action=reply`);
    };

    const cancelReply = () => {
        setReplyText('');
        setErrorMsg(null);
        router.replace(getBasePath());
    };

    const handleSubmitReply = async () => {
        const text = replyText.trim();
        if (!text) return;

        if (text.length > charLimit) {
            setErrorMsg(`Reply exceeds the ${charLimit} character limit.`);
            toast.error(`Reply exceeds the ${charLimit} character limit.`);
            return;
        }

        if (!user) {
            setErrorMsg('You must be signed in to reply.');
            toast.error('You must be signed in to reply.');
            return;
        }

        setSubmitting(true);
        setErrorMsg(null);

        try {
            const messagesColRef = collection(
                db,
                'support-tickets',
                ticket.id,
                'messages',
            );

            await addDoc(messagesColRef, {
                text,
                senderId: user.uid,
                senderEmail: user.email ?? '',
                senderName: user.fullname ?? 'Agent',
                direction: 'agent', // or 'user' if you reuse this UI for end-user replies
                createdAtServer: serverTimestamp(),
                // isInternal: false,
            });

            const ticketRef = doc(db, 'support-tickets', ticket.id);
            const nextStatus: TicketStatus = ticket.status; // no change
            const nowISO = now.toISOString();
            const nextOverdue = computeOverdue(
                nowISO,
                ticket.priority,
                nextStatus,
            );

            await updateDoc(ticketRef, {
                status: nextStatus,
                updatedAtServer: serverTimestamp(),
                updatedAt: new Date(), // optional if you already show serverTimestamp in UI
                overdue: nextOverdue,
                asAgentReply: true,
                lastAgentReplyAt: now,
            });

            toast.success('Reply sent');
            setReplyText('');
            router.replace(getBasePath()); // strip query
            router.refresh();
        } catch (e) {
            console.error(e);
            setErrorMsg('Could not send your reply. Please try again.');
            toast.error('Could not send your reply. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Cmd/Ctrl+Enter to send
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'enter') {
            e.preventDefault();
            if (!submitting && replyText.trim()) {
                void handleSubmitReply();
            }
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(ticket.id).then(
            () => {
                toast.success('Copied to clipboard');
            },
            () => {
                toast.error('Failed to copy ticket ID to clipboard');
            },
        );
    };

    const initials = (ticket.userName ?? 'U')
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const remaining = charLimit - replyText.length;
    const remainingClass =
        remaining < 0
            ? 'text-destructive'
            : remaining < 100
              ? 'text-amber-600'
              : 'text-muted-foreground';

    return (
        <TicketDetailUI
            ticket={ticket}
            isReplyMode={isReplyMode}
            replyText={replyText}
            handleKeyDown={handleKeyDown}
            handleSubmitReply={handleSubmitReply}
            errorMsg={errorMsg}
            remaining={remaining}
            remainingClass={remainingClass}
            handleCopy={handleCopy}
            openReply={openReply}
            cancelReply={cancelReply}
            textAreaRef={textAreaRef}
            handleChange={handleChange}
            initials={initials}
            submitting={submitting}
            charLimit={charLimit}
        />
    );
}
