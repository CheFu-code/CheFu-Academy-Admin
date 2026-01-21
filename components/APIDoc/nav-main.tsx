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
import { type LucideIcon } from 'lucide-react';

export function APINavMain({
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
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Documentations</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = !!item.items?.length;

                    return (
                        <Collapsible
                            key={item.title}
                            defaultOpen={item.isActive}
                        >
                            <SidebarMenuItem>
                                {/* Trigger handles collapse */}
                                <CollapsibleTrigger
                                    asChild
                                    className="cursor-pointer"
                                >
                                    <SidebarMenuButton className="flex justify-between items-center w-full">
                                        <div className="flex items-center gap-2">
                                            <item.icon
                                                size={18}
                                                className="text-primary"
                                            />
                                            <span className="font-semibold text-primary">
                                                {item.title}
                                            </span>
                                        </div>
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
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
