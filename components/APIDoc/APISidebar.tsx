'use client';

import { CodeXmlIcon } from 'lucide-react';
import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { APINavMain } from './nav-main';
import Link from 'next/link';

const data = {
    navMain: [
        {
            title: 'Getting Started',
            url: '#',
            icon: CodeXmlIcon,
            isActive: true,
            items: [
                { title: 'Installation', url: '/api-docs/installation' },
                { title: 'Authentication', url: '/api-docs/authentication' },
                { title: 'Requests', url: '/api-docs/requests' },
                {
                    title: 'Error Handling',
                    url: '/api-docs/error-handling',
                },
                {
                    title: 'Rate Limits & Usage',
                    url: '/api-docs/rate-limits',
                },
            ],
        },
    ],
};

const APISidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={'/api-docs'}>
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
                                        CheFu Academy Docs
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground font-mono">
                                        Latest Version: 1.0.0
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <APINavMain items={data.navMain} />
            </SidebarContent>
        </Sidebar>
    );
};

export default APISidebar;
