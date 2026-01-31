'use client';

import Header from '@/components/Shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardUIProps } from '@/types';
import { Bell, BookOpen, Loader, Lock, Users, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Loader className="animate-spin size-4" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {totalUsers}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {monthlyUsers !== null
                                ? `+${monthlyUsers} this month`
                                : '—'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Courses
                        </CardTitle>
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Loader className="animate-spin size-4" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {totalCourses}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {monthlyCourses !== null
                                ? `+${monthlyCourses} this month`
                                : '—'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Videos
                        </CardTitle>
                        <Video className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Loader className="animate-spin size-4" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {totalVideos}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {monthlyVideos !== null
                                ? `+${monthlyVideos} this month`
                                : '—'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            API Keys
                        </CardTitle>
                        <Lock className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Loader className="animate-spin size-4" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {totalAPIKeys}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {monthlyAPIKeys !== null
                                ? `+${monthlyAPIKeys} this month`
                                : '—'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Section */}
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 shadow-xl">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            'New user registered',
                            'Course "React Native" published',
                            'Subscription upgraded',
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between rounded-lg border bg-background p-3"
                            >
                                <span className="text-sm">{item}</span>
                                <span className="text-xs text-muted-foreground">
                                    Just now
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

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
