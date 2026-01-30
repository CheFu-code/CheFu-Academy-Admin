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
    SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { ChevronRight, type LucideIcon } from 'lucide-react';

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
    return (
        <SidebarGroup>
            <SidebarGroupLabel>
                Study Center
            </SidebarGroupLabel>
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
                                    className="cursor-pointer"
                                >
                                    <SidebarMenuButton className="flex justify-between items-center w-full">
                                        <div className="flex items-center gap-2">
                                            <item.icon size={18} />
                                            <span>{item.title}</span>
                                        </div>
                                        {hasSubItems && (
                                            <ChevronRight className="transition-transform data-[state=open]:rotate-90" />
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
        </SidebarGroup>
    );
}
