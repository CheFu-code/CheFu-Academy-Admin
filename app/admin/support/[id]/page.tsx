// app/admin/support/[id]/page.tsx
import { Suspense } from 'react';
import TicketDetailClient from './ticket-detail-client';
import { getTicketById } from '@/services/tickets';

type PageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ action?: string }>;
};

export default async function TicketDetailPage({
    params,
    searchParams,
}: PageProps) {
    const { id } = await params;
    const { action } = await searchParams;
    const ticket = await getTicketById(id);

    return (
        <Suspense
            fallback={
                <div className="p-6 text-sm text-muted-foreground">
                    Loading…
                </div>
            }
        >
            {/* Pass data and action to a client component to handle interactive UI */}
            <TicketDetailClient ticket={ticket} action={action} />
        </Suspense>
    );
}
