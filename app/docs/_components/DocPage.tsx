import { cn } from '@/lib/utils';
import Link from 'next/link';

export type TocItem = {
    title: string;
    href: string;
};

type DocPageProps = {
    title: string;
    description: string;
    eyebrow?: string;
    toc: TocItem[];
    children: React.ReactNode;
};

export const DocPage = ({
    title,
    description,
    eyebrow = 'Documentation',
    toc,
    children,
}: DocPageProps) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px]">
            <article className="min-w-0 px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
                <div className="mx-auto max-w-4xl">
                    <p className="mb-4 text-sm font-medium text-sky-400">{eyebrow}</p>
                    <h1 className="text-4xl font-semibold tracking-normal text-white sm:text-5xl">
                        {title}
                    </h1>
                    <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
                        {description}
                    </p>
                    <div className="mt-12 border-t border-white/10 pt-10">
                        {children}
                    </div>
                </div>
            </article>
            <aside className="hidden border-l border-white/10 xl:block">
                <div className="docs-scrollbar sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto px-8 py-12">
                    <p className="text-sm font-semibold text-white">On this page</p>
                    <nav className="mt-5 space-y-3">
                        {toc.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block text-sm leading-6 text-zinc-500 transition hover:text-white"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-8 border-t border-white/10 pt-6">
                        <a
                            href="https://github.com/CheFu-code/CheFu-Academy-SDK"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-zinc-500 transition hover:text-white"
                        >
                            Edit this SDK on GitHub
                        </a>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export const DocSection = ({
    id,
    title,
    children,
    className,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <section id={id} className={cn('scroll-mt-24 py-9', className)}>
            <h2 className="text-2xl font-semibold tracking-normal text-white">
                {title}
            </h2>
            <div className="mt-5 space-y-5 text-base leading-8 text-zinc-300">
                {children}
            </div>
        </section>
    );
};

export const DocCallout = ({
    title,
    children,
    tone = 'blue',
}: {
    title: string;
    children: React.ReactNode;
    tone?: 'blue' | 'green' | 'amber' | 'neutral';
}) => {
    const toneClasses = {
        blue: 'border-sky-500/25 bg-sky-500/10 text-sky-100',
        green: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-100',
        amber: 'border-amber-500/25 bg-amber-500/10 text-amber-100',
        neutral: 'border-white/10 bg-white/[0.04] text-zinc-200',
    };

    return (
        <div className={cn('rounded-lg border p-4', toneClasses[tone])}>
            <p className="font-semibold text-white">{title}</p>
            <div className="mt-2 text-sm leading-6 text-zinc-300">{children}</div>
        </div>
    );
};

export const MethodList = ({
    items,
}: {
    items: { name: string; description: string }[];
}) => {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
                <div
                    key={item.name}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                >
                    <code className="text-sm text-sky-300">{item.name}</code>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {item.description}
                    </p>
                </div>
            ))}
        </div>
    );
};
