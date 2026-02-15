import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import {
    collection,
    limit,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import { ChevronRight, Ticket, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon: LucideIcon;
        isActive?: boolean;
        items?: { title: string; url: string }[];
    }[];
}) {
    const { user } = useAuthUser();
    const [hasTicketReply, setHasTicketReply] = useState(false);

    useEffect(() => {
        if (!user?.email) {
            setHasTicketReply(false);
            return;
        }

        const repliedTicketsQuery = query(
            collection(db, 'support-tickets'),
            where('email', '==', user.email),
            where('hasAgentReply', '==', true),
            limit(1),
        );

        const unsubscribe = onSnapshot(
            repliedTicketsQuery,
            (snapshot) => {
                setHasTicketReply(!snapshot.empty);
            },
            (error) => {
                console.error('Error checking replied tickets:', error);
                setHasTicketReply(false);
            },
        );

        return () => unsubscribe();
    }, [user?.email]);

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Study Center</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = !!item.items?.length;

                    return (
                        <Collapsible
                            key={item.title}
                            defaultOpen={item.isActive}
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger
                                    asChild
                                    className="group cursor-pointer"
                                >
                                    <SidebarMenuButton className="flex justify-between items-center w-full">
                                        <div className="flex items-center gap-2">
                                            <item.icon size={18} />
                                            <span>{item.title}</span>
                                        </div>
                                        {hasSubItems && (
                                            <ChevronRight className="transition-transform group-data-[state=open]:rotate-90" />
                                        )}
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                {hasSubItems && (
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                    >
                                                        <a href={subItem.url}>
                                                            {subItem.title}
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                )}

                                {/* If no subitems, render normal link */}
                                {!hasSubItems && (
                                    <a
                                        href={item.url}
                                        className="absolute inset-0"
                                        aria-hidden="true"
                                    />
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>

            <SidebarMenuSubItem key="support">
                <SidebarMenuSubButton asChild>
                    <a
                        href={`/support/${user?.uid}/tickets`}
                        className="flex items-center gap-2 font-bold"
                    >
                        <Ticket size={16} />
                        <span>Support Tickets</span>
                        {hasTicketReply ? (
                            <span
                                className="size-2 rounded-full bg-green-500 animate-pulse"
                                aria-label="You have replied support tickets"
                            />
                        ) : null}
                    </a>
                </SidebarMenuSubButton>
            </SidebarMenuSubItem>
        </SidebarGroup>
    );
}
