'use client';

import SupportTicketsUI from '@/components/ui/SupportTicketsUI';
import { generateTicketID } from '@/helpers/generateRandomID';
import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import { Ticket, TicketPriority, TicketStatus } from '@/types/supportTicket';
import { downloadTicketPDF } from '@/utils/download-pdf';
import { computeOverdue } from '@/utils/ticketSLA';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const SupportTickets = () => {
    const router = useRouter();
    const { user } = useAuthUser();
    const [title, setTitle] = React.useState<string>('');
    const [message, setMessage] = React.useState<string>('');
    const [priority, setPriority] = React.useState<TicketPriority>('low');
    const [ticketID, setTicketID] = React.useState<string>('');
    const [submittingTicket, setSubmittingTicket] =
        React.useState<boolean>(false);

    const handleGenerateTicketID = () => {
        const id = generateTicketID();
        setTicketID(id);
    };

    const submitTicket = async () => {
        if (!title.trim()) {
            toast.error('Please enter a title.');
            return;
        }
        if (!message.trim()) {
            toast.error('Please enter a message/description.');
            return;
        }

        setSubmittingTicket(true);
        try {
            const id =
                ticketID ||
                'TICKET-' +
                    Math.random().toString(36).substr(2, 9).toUpperCase();

            const status: TicketStatus = 'open';
            const updatedAt = new Date();

            const ticket: Ticket = {
                id,
                title: title.trim(),
                message: message.trim(),
                createdAt: new Date(),
                email: user?.email || '',
                userId: user?.uid || '',
                status,
                priority,
                userName: user?.fullname || 'Anonymous',
                updatedAt,
                overdue: computeOverdue(
                    updatedAt.toISOString(),
                    priority,
                    status,
                ),
                hasAgentReply: false,
                lastAgentReplyAt: null,
            };

            const ticketRef = doc(db, 'support-tickets', id);
            await setDoc(ticketRef, {
                ...ticket,
                updatedAtServer: serverTimestamp(),
            });

            toast.success('Ticket submitted successfully!');
            setTitle('');
            setMessage('');
            setTicketID('');

            downloadTicketPDF(ticket, {
                title: 'Support Ticket',
                fileName: `${ticket.id}-ticket.pdf`,
                logoDataUrl: '/logo.png',
            });

            router.back();
        } catch (error) {
            toast.error('Failed to submit ticket. Please try again.');
            console.error('Error submitting ticket:', error);
        } finally {
            setSubmittingTicket(false);
        }
    };

    return (
        <SupportTicketsUI
            ticketID={ticketID}
            handleGenerateTicketID={handleGenerateTicketID}
            submittingTicket={submittingTicket}
            submitTicket={submitTicket}
            title={title}
            setTitle={setTitle}
            message={message}
            setMessage={setMessage}
            priority={priority}
            setPriority={setPriority}
        />
    );
};

export default SupportTickets;
