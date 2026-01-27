import { ThemeToggle } from '@/components/ui/themeToggle';
import { navigationItems } from '@/constants/Data';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import UserDropdown from './UserDropdown';
import { buttonVariants } from '@/components/ui/button';
import { User } from '@/types/user';

interface DesktopMenuProps {
    user: User | null;
    loading: boolean;
}

const DesktopMenu = ({ user, loading }: DesktopMenuProps) => {
    return (
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
            <div className="items-center space-x-4 ">
                {navigationItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center space-x-4 justify-end">
                <ThemeToggle />
                {loading ? (
                    <Loader className="size-4 animate-spin" />
                ) : user ? (
                    <Link
                        href="/"
                        className="text-sm font-medium transition-colors hover:text-primary"
                    >
                        <UserDropdown user={user} />
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className={buttonVariants({ size: 'sm' })}
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default DesktopMenu;
