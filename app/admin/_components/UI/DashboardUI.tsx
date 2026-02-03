'use client';

import Header from '@/components/Shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardUIProps } from '@/types';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Stats from './Dashboard/Stats';
import Summary from './Dashboard/Summary';
import TicketsList from './Dashboard/TicketsList';

export default function DashboardUI({
    totalUsers,
    loading,
    monthlyUsers,
    totalCourses,
    monthlyCourses,
    totalVideos,
    monthlyVideos,
    totalAPIKeys,
    monthlyAPIKeys,
    recentTickets,
    openTickets,
    pendingTickets,
    resolvedTickets,
    overdueTickets,
}: DashboardUIProps) {
    const router = useRouter();
    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <Header
                    header="Admin Dashboard"
                    description="Overview of CheFu Academy"
                />

                <Button variant="outline" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
            </div>
            {/* Stats */}
            <Stats
                loading={loading}
                totalUsers={totalUsers}
                monthlyUsers={monthlyUsers}
                totalCourses={totalCourses}
                monthlyCourses={monthlyCourses}
                totalVideos={totalVideos}
                monthlyVideos={monthlyVideos}
                totalAPIKeys={totalAPIKeys}
                monthlyAPIKeys={monthlyAPIKeys}
            />

            {/* Support Tickets / Issues Section */}
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {/* Summary / KPI Cards */}
                {/* {openTickets &&
                    pendingTickets &&
                    resolvedTickets &&
                    overdueTickets && ( */}
                        <Summary
                            openTickets={openTickets}
                            pendingTickets={pendingTickets}
                            resolvedTickets={resolvedTickets}
                            overdueTickets={overdueTickets}
                            loading={loading}
                        />
                    {/* )} */}

                {/* Tickets List */}
                <TicketsList loading={loading} recentTickets={recentTickets} />

                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle>Admin Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer"
                            onClick={() => router.push('/admin/manage-users')}
                        >
                            Manage Users
                        </Button>
                        <Button
                            onClick={() => router.push('/admin/reports')}
                            variant="secondary"
                            className="w-full cursor-pointer"
                        >
                            View Reports
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
