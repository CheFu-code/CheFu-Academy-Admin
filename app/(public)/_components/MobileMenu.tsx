import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/themeToggle';
import { navigationItems } from '@/constants/Data';
import { Loader, Menu } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import UserDropdown from './UserDropdown';
import { buttonVariants } from '@/components/ui/button';
import { User } from '@/types/user';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface MobileMenuProps {
    user: User | null;
    loading: boolean;
}

const MobileMenu = ({ user, loading }: MobileMenuProps) => {
    return (
        <div className="ml-auto md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent">
                        <Menu className="h-5 w-5 cursor-pointer" />
                    </button>
                </SheetTrigger>

                <SheetContent side="right" className="w-72">
                    <VisuallyHidden>
                        <SheetTitle>Navigation menu</SheetTitle>
                    </VisuallyHidden>

                    <div className="flex flex-col space-y-6 mt-10 ml-4">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-semibold transition-colors hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="pt-4 border-t flex items-center justify-between">
                            <ThemeToggle />

                            {loading ? (
                                <Loader className="size-4 animate-spin" />
                            ) : user ? (
                                <UserDropdown user={user} />
                            ) : (
                                <Link
                                    href="/login"
                                    className={buttonVariants({
                                        size: 'sm',
                                    })}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MobileMenu;
