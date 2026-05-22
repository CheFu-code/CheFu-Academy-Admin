import { ThemeToggle } from '@/components/ui/themeToggle';
import { navigationItems } from '@/constants/Data';
import Link from 'next/link';
import React from 'react';
import { buttonVariants } from '@/components/ui/button';

const DesktopMenu = () => {
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
                <Link
                    href="/login"
                    className={buttonVariants({ size: 'sm' })}
                >
                    Login
                </Link>
            </div>
        </nav>
    );
};

export default DesktopMenu;
