'use client';

import { BookOpen, LifeBuoy, Send, Settings2, Video } from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuthUser } from '@/hooks/useAuthUser';
import Image from 'next/image';
import Link from 'next/link';

const data = {
    navMain: [
        {
            title: 'Courses',
            url: '#',
            icon: BookOpen,
            isActive: true,
            items: [
                // { title: 'Practice', url: '/courses/practice' },
                { title: 'All Courses', url: '/courses' },
                { title: 'My Courses', url: '/courses/my-courses' },
                {
                    title: 'Completed Courses',
                    url: '/courses/completed-lessons',
                },
            ],
        },

        {
            title: 'Videos',
            url: '#',
            icon: Video,
            items: [
                // {
                //     title: 'All Videos',
                //     url: '/videos/all-videos',
                // },
                {
                    title: 'Advanced Videos',
                    url: '/videos/advanced',
                },
                {
                    title: 'Beginner Videos',
                    url: '/videos/beginner',
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'Account',
                    url: '/settings/account',
                },
                {
                    title: 'Billing',
                    url: '/settings/billing',
                },
                {
                    title: 'Privacy Policy',
                    url: '/privacy-policy',
                },
                {
                    title: 'Terms of Service',
                    url: '/terms-service',
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: 'Support',
            url: '/support',
            icon: LifeBuoy,
        },
        {
            title: 'Feedback',
            url: '/feedback',
            icon: Send,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuthUser();
    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Image
                                        alt="Logo"
                                        width={52}
                                        height={52}
                                        src={'/logo.png'}
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        CheFu Academy
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Smart Learners Platform
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>

            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
        </Sidebar>
    );
}
