'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/hooks/useAuthUser';

export default function RedirectIfNoCountry() {
    const router = useRouter();
    const { user, loading } = useAuthUser();

    useEffect(() => {
        if (!user || loading) return;

        const userCountry = user?.country;

        if (!userCountry || userCountry === '') {
            const timer = setTimeout(() => {
                router.push(`/add-country/${user?.uid}`);
            }, 5000); // 10 seconds

            return () => clearTimeout(timer);
        }
    }, [loading, router, user]);

    return null;
}
