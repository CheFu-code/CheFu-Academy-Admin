'use client';

import {
    BadgeCheck,
    ChevronsUpDown,
    CreditCard,
    Loader,
    LogOut,
    Sparkles,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { auth } from '@/lib/firebase';
import { User } from '@/types/user';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { signOut } from 'firebase/auth';

export function NavUser({ user }: { user: User }) {
    const { isMobile } = useSidebar();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            toast.success('Successfully signed out');
        } catch (error) {
            toast.error('Error signing out');
            console.error('Error signing out:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user.profilePicture}
                                    alt={user.fullname}
                                />
                                <AvatarFallback>
                                    {user?.fullname?.[0] || 'CA'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.fullname}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user.profilePicture}
                                        alt={user.fullname}
                                    />
                                    <AvatarFallback>
                                        {user?.fullname?.[0] || 'CA'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user.fullname}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        {user.member === false && <DropdownMenuSeparator />}
                        {user.member === false && (
                            <DropdownMenuGroup asChild>
                                <Link href="/settings/billing">
                                    <DropdownMenuItem className="hover:bg-primary cursor-pointer">
                                        <Sparkles />
                                        Upgrade to Pro
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuGroup>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                asChild
                                className="hover:bg-primary cursor-pointer"
                            >
                                <Link href="/settings/account">
                                    <BadgeCheck />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                asChild
                                className="hover:bg-primary cursor-pointer"
                            >
                                <Link href="/settings/billing">
                                    <CreditCard />
                                    Billing
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <Button
                            className="m-2"
                            size={'sm'}
                            variant={'destructive'}
                            onClick={handleLogout}
                        >
                            <DropdownMenuItem>
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <div className="hover:text-shadow-red-500 hover:text-red-300 cursor-pointer flex items-center gap-1">
                                        <LogOut className="text-red-100" />
                                        Log out
                                    </div>
                                )}
                            </DropdownMenuItem>
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
