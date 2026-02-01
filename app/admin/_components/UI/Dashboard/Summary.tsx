'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supportKpis } from '@/constants/Data';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Summary = ({ loading }: { loading: boolean }) => {
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
                                supportKpis.open
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
                                supportKpis.pendingResponses
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
                                supportKpis.resolvedToday
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
                                supportKpis.overdue
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
                        onClick={() => router.push('/admin/support/new')}
                    >
                        New Ticket
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
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
