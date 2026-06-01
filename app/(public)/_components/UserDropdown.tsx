'use client';

import { CheFuUserDropdown } from 'chefu-ui';
import {
    BookOpen,
    Home,
    LayoutDashboardIcon,
    UserRound,
} from 'lucide-react';

import { useSignOut } from '@/hooks/useSignOut';
import { chefuManageAccountUrl } from '@/lib/chefu-account';
import { UserDropdownProps } from '@/types/user';

export default function UserDropdown({ user }: UserDropdownProps) {
    const { handleLogout } = useSignOut();

    return (
        <CheFuUserDropdown
            accountHref={chefuManageAccountUrl()}
            accountLabel="CheFu Account"
            actions={[
                {
                    href: '/settings/account',
                    icon: UserRound,
                    label: 'Academy profile',
                },
                {
                    href: '/',
                    icon: Home,
                    label: 'Home',
                },
                {
                    href: '/videos/all-videos',
                    icon: LayoutDashboardIcon,
                    label: 'Videos',
                },
                {
                    href: '/courses',
                    icon: BookOpen,
                    label: 'Courses',
                },
            ]}
            onSignOut={handleLogout}
            signOutLabel="Logout"
            user={{
                displayName: user?.fullname,
                email: user?.email,
                photoURL: user?.profilePicture,
            }}
            variant="cyan"
        />
    );
}
