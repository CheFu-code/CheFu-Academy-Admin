'use client';

import { buttonVariants } from '@/components/ui/button';
import { useAuthUser } from '@/hooks/useAuthUser';
import Link from 'next/link';
import UserDropdown from './UserDropdown';

export default function AuthNavAction() {
    const { user, loading } = useAuthUser();

    if (loading) {
        return <div className="h-9 w-20 rounded-md bg-muted" aria-hidden />;
    }

    if (user) {
        return <UserDropdown user={user} />;
    }

    return (
        <Link href="/login" className={buttonVariants({ size: 'sm' })}>
            Login
        </Link>
    );
}
