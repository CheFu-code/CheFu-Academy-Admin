'use client';

import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/themeToggle';
import { navigationItems } from '@/constants/Data';
import { useAuthUser } from '@/hooks/useAuthUser';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import UserDropdown from './UserDropdown';

export default function Navbar() {
    const { user, loading } = useAuthUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60 ">
            <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex items-center space-x-2 py-4 mr-4"
                >
                    <Image
                        width={50}
                        height={50}
                        src="/logo.png"
                        alt="Logo"
                        className="h-auto"
                    />
                    <span className="font-bold">CheFu Academy</span>
                </Link>

                <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                    {loading ? (
                        <Loader className="size-4 animate-spin" />
                    ) : (
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
                    )}

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
            </div>
        </header>
    );
}
