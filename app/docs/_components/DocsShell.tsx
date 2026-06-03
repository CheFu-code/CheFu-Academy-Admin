import {
    BookOpen,
    Code2,
    ExternalLink,
    KeyRound,
    Search,
    ShieldCheck,
    TerminalSquare,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DocsNavLink from './DocsNavLink';

const navSections = [
    {
        title: 'Getting Started',
        items: [
            { title: 'Overview', href: '/docs' },
            { title: 'Installation', href: '/docs/installation' },
            { title: 'Authentication', href: '/docs/authentication' },
            { title: 'Making Requests', href: '/docs/requests' },
        ],
    },
    {
        title: 'Reference',
        items: [
            { title: 'Courses API', href: '/docs/requests#courses-api' },
            { title: 'Videos API', href: '/docs/requests#videos-api' },
            { title: 'API Keys', href: '/docs/requests#api-keys' },
            { title: 'Error Handling', href: '/docs/error-handling' },
            { title: 'Rate Limits', href: '/docs/rate-limits' },
        ],
    },
];

export const DocsHeader = () => {
    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-[1680px] items-center gap-4 px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white">
                        <Image src="/logo.png" alt="CheFu Academy" width={26} height={26} />
                    </span>
                    <span className="hidden text-lg font-semibold tracking-normal text-white sm:block">
                        CheFu Academy
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 text-sm lg:flex">
                    <Link
                        href="/courses"
                        className="rounded-md px-3 py-2 text-zinc-400 transition hover:text-white"
                    >
                        Courses
                    </Link>
                    <Link
                        href="/videos/all-videos"
                        className="rounded-md px-3 py-2 text-zinc-400 transition hover:text-white"
                    >
                        Videos
                    </Link>
                    <Link
                        href="/docs"
                        className="rounded-md px-3 py-2 font-medium text-sky-400"
                    >
                        Docs
                    </Link>
                    <a
                        href="https://www.npmjs.com/package/chefu-academy-sdk"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-zinc-400 transition hover:text-white"
                    >
                        SDK
                        <ExternalLink className="size-3.5" />
                    </a>
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <div className="hidden h-10 w-[320px] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-500 xl:flex">
                        <Search className="size-4" />
                        <span className="flex-1">Search documentation...</span>
                        <kbd className="rounded-md border border-white/10 bg-black px-1.5 py-0.5 text-xs text-zinc-300">
                            CtrlK
                        </kbd>
                    </div>
                    <Link
                        href="/feedback"
                        className="hidden rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:bg-white/[0.04] md:inline-flex"
                    >
                        Feedback
                    </Link>
                    <Link
                        href="/courses"
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                    >
                        Learn
                    </Link>
                </div>
            </div>
        </header>
    );
};

export const DocsSidebar = () => {
    return (
        <aside className="hidden border-r border-white/10 lg:block">
            <div className="docs-scrollbar sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto px-5 py-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border border-sky-500/20 bg-sky-500/10 p-3">
                        <span className="flex size-10 items-center justify-center rounded-md border border-sky-400/30 bg-sky-500/10 text-sky-300">
                            <TerminalSquare className="size-5" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-white">CheFu SDK</p>
                            <p className="text-xs text-zinc-400">Latest version 1.0.9</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                        <span className="flex size-10 items-center justify-center rounded-md border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                            <ShieldCheck className="size-5" />
                        </span>

                    </div>
                </div>

                <nav className="mt-8 space-y-7">
                    {navSections.map((section) => (
                        <div key={section.title}>
                            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-normal text-zinc-500">
                                {section.title}
                            </p>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <DocsNavLink key={item.href} href={item.href}>
                                        {item.title}
                                    </DocsNavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="mt-10 space-y-3 border-t border-white/10 pt-6">
                    <Link
                        href="/docs/installation"
                        className="flex items-center gap-3 rounded-lg border border-white/10 p-3 text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
                    >
                        <KeyRound className="size-4 text-sky-300" />
                        Create an API key
                    </Link>
                    <Link
                        href="/docs/requests"
                        className="flex items-center gap-3 rounded-lg border border-white/10 p-3 text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
                    >
                        <Code2 className="size-4 text-violet-300" />
                        Explore SDK methods
                    </Link>
                    <Link
                        href="/support"
                        className="flex items-center gap-3 rounded-lg border border-white/10 p-3 text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
                    >
                        <BookOpen className="size-4 text-emerald-300" />
                        Get help
                    </Link>
                </div>
            </div>
        </aside>
    );
};
