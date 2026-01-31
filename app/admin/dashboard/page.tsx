'use client';

import {
    getMonthlyAPIKeys,
    getMonthlyCourses,
    getMonthlyUsers,
    getMonthlyVideos,
    getTotalAPIKeys,
    getTotalCourses,
    getTotalUsers,
    getTotalVideos,
} from '@/helpers/getAnalytics';
import { useEffect, useState } from 'react';
import DashboardUI from '../_components/UI/DashboardUI';

const Dashboard = () => {
    type Analytics = {
        totalUsers: number | null;
        monthlyUsers: number | null;
        totalCourses: number | null;
        monthlyCourses: number | null;
        totalVideos: number | null;
        monthlyVideos: number | null;
        totalAPIKeys: number | null;
        monthlyAPIKeys: number | null;
    };

    const [analytics, setAnalytics] = useState<Analytics>({
        totalUsers: null,
        monthlyUsers: null,
        totalCourses: null,
        monthlyCourses: null,
        totalVideos: null,
        monthlyVideos: null,
        totalAPIKeys: null,
        monthlyAPIKeys: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [
                    totalUsers,
                    monthlyUsers,
                    totalCourses,
                    monthlyCourses,
                    totalVideos,
                    monthlyVideos,
                    totalAPIKeys,
                    monthlyAPIKeys,
                ] = await Promise.all([
                    getTotalUsers(),
                    getMonthlyUsers(),
                    getTotalCourses(),
                    getMonthlyCourses(),
                    getTotalVideos(),
                    getMonthlyVideos(),
                    getTotalAPIKeys(),
                    getMonthlyAPIKeys(),
                ]);

                setAnalytics({
                    totalUsers,
                    monthlyUsers,
                    totalCourses,
                    monthlyCourses,
                    totalVideos,
                    monthlyVideos,
                    totalAPIKeys,
                    monthlyAPIKeys,
                });
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);
    return (
        <DashboardUI
            totalUsers={analytics.totalUsers}
            monthlyUsers={analytics.monthlyUsers}
            loading={loading}
            totalCourses={analytics.totalCourses}
            monthlyCourses={analytics.monthlyCourses}
            totalVideos={analytics.totalVideos}
            monthlyVideos={analytics.monthlyVideos}
            totalAPIKeys={analytics.totalAPIKeys}
            monthlyAPIKeys={analytics.monthlyAPIKeys}
        />
    );
};

export default Dashboard;
