'use client';

import React, { useEffect, useState } from 'react';
import GetAllSupportTickets from '../../_components/UI/Dashboard/GetAllSupportTickets';
import { subscribeToAllTickets } from '@/services/tickets';
import { Ticket } from '@/types/supportTicket';
import { useRouter } from 'next/navigation';

const SupportTickets = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [allTickets, setAllTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = subscribeToAllTickets(
            (tickets) => {
                setAllTickets(tickets);
                setLoading(false);
            },
            (error) => {
                console.error('error fetching all tickets', error);
                setLoading(false);
            },
        );
        return () => unsubscribe();
    }, []);
    return (
        <GetAllSupportTickets
            allTickets={allTickets}
            router={router}
            loading={loading}
        />
    );
};

export default SupportTickets;
