'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/lib/firebase';

export function TrackPageView() {
    const pathname = usePathname();

    useEffect(() => {
        if (!analytics) return;

        logEvent(analytics, 'page_view', {
            page_path: pathname,
        });
    }, [pathname]);

    return null;
}
