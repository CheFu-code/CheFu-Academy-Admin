'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type DocsNavLinkProps = {
    href: string;
    children: React.ReactNode;
};

const DocsNavLink = ({ href, children }: DocsNavLinkProps) => {
    const pathname = usePathname();
    const isActive =
        pathname === href || (href !== '/docs' && pathname.startsWith(href));

    return (
        <Link
            href={href}
            className={cn(
                'block rounded-md px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white',
                isActive && 'bg-white/[0.06] text-white',
            )}
        >
            {children}
        </Link>
    );
};

export default DocsNavLink;
