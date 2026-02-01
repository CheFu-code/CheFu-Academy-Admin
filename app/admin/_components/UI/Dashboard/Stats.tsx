import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardUIProps } from '@/types';
import { BookOpen, Loader, Lock, Users, Video } from 'lucide-react';
import React from 'react';

const Stats = ({
    loading,
    totalUsers,
    monthlyUsers,
    totalCourses,
    monthlyCourses,
    totalVideos,
    monthlyVideos,
    totalAPIKeys,
    monthlyAPIKeys,
}: DashboardUIProps) => {
    return (
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
                            {totalUsers ?? '—'}
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
                        <div className="text-2xl font-bold">{totalCourses}</div>
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
                        <div className="text-2xl font-bold">{totalVideos}</div>
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
                        <div className="text-2xl font-bold">{totalAPIKeys}</div>
                    )}
                    <p className="text-xs text-muted-foreground">
                        {monthlyAPIKeys !== null
                            ? `+${monthlyAPIKeys} this month`
                            : '—'}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Stats;
