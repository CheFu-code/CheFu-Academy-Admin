'use client';

import { useAuthUser } from '@/hooks/useAuthUser';
import Image from 'next/image';
import Link from 'next/link';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

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

                {/* Mobile Menu */}
                <MobileMenu user={user} loading={loading} />
                <DesktopMenu user={user} loading={loading} />
            </div>
        </header>
    );
}
