'use client';

import SupportTicketsUI from '@/components/ui/SupportTicketsUI';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const SupportTickets = () => {
    const router = useRouter();
    const [title, setTitle] = React.useState<string>('');
    const [message, setMessage] = React.useState<string>('');
    const [ticketID, setTicketID] = React.useState<string>('');
    const [submittingTicket, setSubmittingTicket] =
        React.useState<boolean>(false);

    const generateTicketID = () => {
        const newID =
            'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        setTicketID(newID);
    };

    const submitTicket = () => {
        setSubmittingTicket(true);
        try {
            toast.success('Ticket submitted successfully!');
            setTitle('');
            setMessage('');
            setTicketID('');
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
            generateTicketID={generateTicketID}
            submittingTicket={submittingTicket}
            submitTicket={submitTicket}
            title={title}
            setTitle={setTitle}
            message={message}
            setMessage={setMessage}
        />
    );
};

export default SupportTickets;
