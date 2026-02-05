'use client';

import { IconCirclePlusFilled, IconMail, type Icon } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getTotalUnreadTickets } from '@/helpers/getAnalytics';
import { Analytics2 } from '@/types/analytics';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: Icon;
    }[];
}) {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<Analytics2>({
        unreadTicket: null,
    });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [unreadTicket] = await Promise.all([
                    getTotalUnreadTickets(),
                ]);

                setAnalytics({
                    unreadTicket,
                });
            } catch (err) {
                console.error('oops fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <SidebarMenuButton
                            asChild
                            tooltip="Upload Video"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                        >
                            <Link
                                href="/admin/videos/upload-video"
                                className="flex items-center gap-2"
                            >
                                <IconCirclePlusFilled />
                                <span>Upload Video</span>
                            </Link>
                        </SidebarMenuButton>

                        <Button
                            size="icon"
                            className="size-8 relative group-data-[collapsible=icon]:opacity-0"
                            variant="outline"
                        >
                            <IconMail />
                            {loading ? (
                                <Loader
                                    className="inline-block size-4 animate-spin text-muted-foreground"
                                    aria-label="Loading unread tickets"
                                />
                            ) : Number(analytics.unreadTicket) > 0 ? (
                                <span
                                    className="text-green-500 font-semibold absolute -top-1.5 left-5"
                                    aria-label={`${analytics.unreadTicket} unread tickets`}
                                >
                                    {Number(analytics.unreadTicket) > 99
                                        ? '99+'
                                        : analytics.unreadTicket}
                                </span>
                            ) : null}
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Main Navigation Items */}
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild tooltip={item.title}>
                                <Link
                                    href={item.url}
                                    className="flex items-center gap-2"
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
