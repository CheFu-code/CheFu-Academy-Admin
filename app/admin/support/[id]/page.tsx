// app/admin/support/[id]/page.tsx
import { Suspense } from 'react';
import TicketDetailClient from './ticket-detail-client';

type PageProps = {
    params: { id: string };
    searchParams: { action?: string };
};

export default async function TicketDetailPage({
    params,
    searchParams,
}: PageProps) {
    // TODO: Replace with real fetch (server-side) to get ticket detail by ID
    // Example:
    // const ticket = await getTicketById(params.id);
    const ticket = {
        id: params.id,
        title: 'Cannot access purchased course',
        status: 'open',
        priority: 'high',
        userName: 'Alice M.',
        updatedAt: '2h ago',
        messages: [
            {
                from: 'user',
                text: 'I bought React course but it’s locked',
                at: '2026-02-01 10:12',
            },
            {
                from: 'support',
                text: 'We’re checking—thanks!',
                at: '2026-02-01 10:20',
            },
        ],
    } as const;

    return (
        <Suspense
            fallback={
                <div className="p-6 text-sm text-muted-foreground">
                    Loading…
                </div>
            }
        >
            {/* Pass data and action to a client component to handle interactive UI */}
            <TicketDetailClient ticket={ticket} action={searchParams.action} />
        </Suspense>
    );
}
