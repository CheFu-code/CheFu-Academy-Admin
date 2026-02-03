'use client';

import SupportTicketsUI from '@/components/ui/SupportTicketsUI';
import { generateTicketID } from '@/helpers/generateRandomID';
import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import { Ticket, TicketPriority, TicketStatus } from '@/types/supportTicket';
import { downloadTicketPDF } from '@/utils/download-pdf';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const SLA_HOURS_BY_PRIORITY: Record<TicketPriority, number> = {
    low: 72,
    medium: 48,
    high: 24,
    urgent: 8,
};

const SupportTickets = () => {
    const router = useRouter();
    const { user } = useAuthUser();
    const [title, setTitle] = React.useState<string>('');
    const [message, setMessage] = React.useState<string>('');
    const [priority, setPriority] = React.useState<TicketPriority>('low');
    const [ticketID, setTicketID] = React.useState<string>('');
    const [submittingTicket, setSubmittingTicket] =
        React.useState<boolean>(false);

    const computeOverdue = (
        updatedAtISO: string,
        priorityValue: TicketPriority,
        statusValue: TicketStatus,
    ): boolean => {
        // If ticket is resolved/closed, it's not overdue
        if (statusValue === 'resolved' || statusValue === 'closed')
            return false;

        const slaHours = SLA_HOURS_BY_PRIORITY[priorityValue] ?? 48;
        const updatedAt = new Date(updatedAtISO).getTime();
        const now = Date.now();
        const hoursElapsed = (now - updatedAt) / (1000 * 60 * 60);
        return hoursElapsed > slaHours;
    };

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
            const updatedAt = new Date().toISOString();

            const ticket: Ticket = {
                id,
                title: title.trim(),
                message: message.trim(),
                createdAt: new Date().toISOString(),
                email: user?.email || '',
                userId: user?.uid || '',
                status,
                priority,
                userName: user?.fullname || 'Anonymous',
                updatedAt,
                overdue: computeOverdue(updatedAt, priority, status),
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
