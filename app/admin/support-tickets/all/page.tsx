'use client';

import { PRIORITY_VALUES } from '@/constants/Data';
import { subscribeToAllTickets } from '@/services/tickets';
import { Ticket } from '@/types/supportTicket';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import GetAllSupportTickets from '../../_components/UI/Dashboard/GetAllSupportTickets';

export type StatusFilter = Ticket['status'] | 'all';
export type PriorityFilter = (typeof PRIORITY_VALUES)[number];

const SupportTickets = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [allTickets, setAllTickets] = useState<Ticket[]>([]);
    const [search, setSearch] = React.useState('');
    const [status, setStatus] = React.useState<Ticket['status'] | 'all'>('all');
    const [onlyOverdue, setOnlyOverdue] = React.useState(false);
    const [priority, setPriority] = React.useState<Ticket['priority'] | 'all'>(
        'all',
    );
    const [agentReply, setAgentReply] = React.useState<
        'all' | 'agent' | 'none'
    >('all');

    // --- NEW: filtered list ---
    const filteredTickets = React.useMemo(() => {
        let rows = allTickets ?? [];

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            rows = rows.filter((t) => {
                const title = t.title?.toLowerCase() ?? '';
                const user = t.userName?.toLowerCase() ?? '';
                const id = t.id?.toLowerCase() ?? '';
                return title.includes(q) || user.includes(q) || id.includes(q);
            });
        }

        if (status !== 'all') {
            rows = rows.filter((t) => t.status === status);
        }

        if (priority !== 'all') {
            rows = rows.filter((t) => t.priority === priority);
        }

        if (onlyOverdue) {
            rows = rows.filter((t) => t.overdue === true);
        }

        if (agentReply !== 'all') {
            rows = rows.filter((t) => {
                const replied =
                    typeof t.hasAgentReply === 'boolean'
                        ? t.hasAgentReply
                        : Boolean(t.lastAgentReplyAt); // fallback if older docs only have timestamp
                return agentReply === 'agent' ? replied : !replied;
            });
        }

        // Optional: sort newest first by createdAt (if it’s a Date)
        rows = rows.slice().sort((a, b) => {
            const aTime = tDate(a.createdAt);
            const bTime = tDate(b.createdAt);
            return bTime - aTime;
        });

        return rows;
    }, [allTickets, search, status, priority, onlyOverdue, agentReply]);

    const isStatusFilter = (v: string): v is StatusFilter =>
        v === 'all' ||
        v === 'open' ||
        v === 'pending' ||
        v === 'resolved' ||
        v === 'closed';

    function tDate(val: unknown): number {
        if (val instanceof Date) return val.getTime();
        return 0;
    }

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
            filteredTickets={filteredTickets}
            router={router}
            loading={loading}
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            priority={priority}
            setPriority={setPriority}
            setOnlyOverdue={setOnlyOverdue}
            onlyOverdue={onlyOverdue}
            setAgentReply={setAgentReply}
            agentReply={agentReply}
            isStatusFilter={isStatusFilter}
        />
    );
};

export default SupportTickets;
