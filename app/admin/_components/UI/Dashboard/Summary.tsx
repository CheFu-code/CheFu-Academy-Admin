'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Summary = ({
    loading,
    openTickets,
    pendingTickets,
    resolvedTickets,
    overdueTickets,
}: {
    loading: boolean;
    openTickets: number;
    pendingTickets: number;
    resolvedTickets: number;
    overdueTickets: number;
}) => {
    const router = useRouter();
    return (
        <Card className="shadow-xl">
            <CardHeader>
                <CardTitle>Support Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">
                            Open tickets
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {loading ? (
                                <Loader className="size-4 animate-spin" />
                            ) : (
                                (openTickets ?? '—')
                            )}
                        </p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">
                            Pending responses
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {loading ? (
                                <Loader className="size-4 animate-spin" />
                            ) : (
                                (pendingTickets ?? '—')
                            )}
                        </p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">
                            Resolved today
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {loading ? (
                                <Loader className="size-4 animate-spin" />
                            ) : (
                                (resolvedTickets ?? '—')
                            )}
                        </p>
                    </div>
                    <div className="rounded-lg border p-3">
                        <p className="text-xs text-muted-foreground">
                            Overdue items
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                            {loading ? (
                                <Loader className="size-4 animate-spin" />
                            ) : (
                                (overdueTickets ?? '—')
                            )}
                        </p>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="mt-4 flex gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => router.push('/admin/support')}
                    >
                        View All
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Summary;
