'use client'
import {
    BookOpen,
    ChevronDownIcon,
    Home,
    LayoutDashboardIcon,
    LogOutIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSignOut } from '@/hooks/useSignOut';
import { UserDropdownProps } from '@/types/user';
import Link from 'next/link';

export default function UserDropdown({ user }: UserDropdownProps) {
    const { handleLogout } = useSignOut()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent"
                >
                    <Avatar>
                        <AvatarImage
                            src={user?.profilePicture}
                            alt="Profile image"
                        />
                        <AvatarFallback>
                            {user?.fullname?.[0] || 'CA'}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                    />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="max-w-64">
                <DropdownMenuItem asChild>
                    <Link href="/settings/account" className="flex min-w-0 flex-col">
                        <span className="text-foreground truncate  text-sm font-medium">
                            {user?.fullname}
                        </span>
                        <span className="text-muted-foreground truncate text-xs font-normal">
                            {user?.email}
                        </span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={'/'} className="flex items-center gap-2">
                            <Home
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Home</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link
                            href={'/videos/all-videos'}
                            className="flex items-center gap-2"
                        >
                            <LayoutDashboardIcon
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Videos</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link
                            href={'/courses'}
                            className="flex items-center gap-2"
                        >
                            <BookOpen
                                size={16}
                                className="opacity-60"
                                aria-hidden="true"
                            />
                            <span>Courses</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                    >
                        <LogOutIcon
                            size={16}
                            className="opacity-60"
                            aria-hidden="true"
                        />
                        <span>Logout</span>
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
