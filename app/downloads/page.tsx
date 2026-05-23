import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Bell,
    BookOpenCheck,
    CheckCircle2,
    Download,
    FileText,
    Laptop,
    Monitor,
    ShieldCheck,
    Sparkles,
    Terminal,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Downloads | CheFu Academy',
    description:
        'Download CheFu Academy for desktop and learn with native notifications, offline course access, and desktop shortcuts.',
};

const releaseVersion = 'Desktop Preview';
const releaseBaseUrl =
    'https://github.com/CheFu-code/CheFu-Academy-Admin/releases/download/desktop-v0.1.0';

const platforms = [
    {
        name: 'Windows',
        icon: Monitor,
        description: 'Windows 10 and 11',
        primaryLabel: 'Windows installer',
        secondaryLabel: 'Portable build',
        availability: 'Available',
        primaryHref: `${releaseBaseUrl}/chefu-academy-setup-0.1.0.exe`,
        secondaryHref: `${releaseBaseUrl}/chefu-academy-portable-0.1.0.exe`,
    },
    {
        name: 'macOS',
        icon: Laptop,
        description: 'Apple Silicon and Intel Macs',
        primaryLabel: 'macOS universal',
        secondaryLabel: 'DMG package',
        availability: 'Coming soon',
        primaryHref: null,
        secondaryHref: null,
    },
    {
        name: 'Linux',
        icon: Terminal,
        description: 'Ubuntu, Debian, Fedora, and AppImage',
        primaryLabel: 'AppImage',
        secondaryLabel: 'Debian package',
        availability: 'Coming soon',
        primaryHref: null,
        secondaryHref: null,
    },
];

const nativeFeatures = [
    {
        title: 'Native Notifications',
        description: 'Get desktop reminders and app messages through your operating system.',
        icon: Bell,
    },
    {
        title: 'Offline Course Cache',
        description: 'Keep recently opened course content available for desktop reading.',
        icon: BookOpenCheck,
    },
    {
        title: 'Native File Import',
        description: 'Import PDF, Markdown, and text files to generate courses from your own material.',
        icon: FileText,
    },
    {
        title: 'Secure Desktop Shell',
        description: 'Electron is isolated with a safe preload bridge and no renderer Node access.',
        icon: ShieldCheck,
    },
];

export default function DownloadsPage() {
    return (
        <main className="min-h-screen bg-background">
            <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
                <div className="flex flex-col justify-center">
                    <Badge className="w-fit bg-cyan-600 text-white">
                        <Sparkles className="mr-1 h-3.5 w-3.5" />
                        {releaseVersion}
                    </Badge>
                    <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
                        CheFu Academy, built for your desktop.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                        Use CheFu Academy with native notifications, system tray actions,
                        file import, offline course caching, and desktop learning reminders.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="#downloads">
                                <Download className="h-4 w-4" />
                                View Downloads
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/dashboard">Open Dashboard</Link>
                        </Button>
                    </div>
                </div>

                <Card className="overflow-hidden border-cyan-500/30 bg-cyan-500/5">
                    <CardHeader>
                        <CardTitle>Desktop features included</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {nativeFeatures.map(({ title, description, icon: Icon }) => (
                            <div
                                key={title}
                                className="flex gap-3 rounded-lg border bg-background p-3"
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">{title}</p>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>

            <section className="border-y bg-muted/30">
                <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
                    <SummaryItem label="Runtime" value="Electron desktop" />
                    <SummaryItem label="Security" value="Isolated preload bridge" />
                    <SummaryItem label="Status" value="Windows build available" />
                </div>
            </section>

            <section id="downloads" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
                <div className="mb-8 flex flex-col gap-2">
                    <p className="text-sm font-medium text-primary">Choose your platform</p>
                    <h2 className="text-3xl font-bold tracking-tight">Desktop downloads</h2>
                    <p className="max-w-2xl text-muted-foreground">
                        The Windows installer and portable build are available now. macOS
                        and Linux builds will appear here when those platform packages are produced.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {platforms.map(platform => (
                        <PlatformCard key={platform.name} platform={platform} />
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
                <Card>
                    <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Developer preview</h2>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Desktop packaging is configured. Use this command while developing
                                native features before making another installer.
                            </p>
                        </div>
                        <div className="rounded-lg border bg-muted px-4 py-3 font-mono text-sm">
                            npm run desktop:dev
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}

function PlatformCard({
    platform,
}: {
    platform: {
        name: string;
        icon: React.ComponentType<{ className?: string }>;
        description: string;
        primaryLabel: string;
        secondaryLabel: string;
        availability: string;
        primaryHref: string | null;
        secondaryHref: string | null;
    };
}) {
    const Icon = platform.icon;

    return (
        <Card className="h-full transition duration-200 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg">
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-muted text-cyan-500">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{platform.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {platform.description}
                            </p>
                        </div>
                    </div>
                    <Badge variant="secondary">{platform.availability}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {platform.primaryHref ? (
                    <Button asChild className="w-full justify-between">
                        <Link href={platform.primaryHref}>
                            <span className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                {platform.primaryLabel}
                            </span>
                            <CheckCircle2 className="h-4 w-4 opacity-70" />
                        </Link>
                    </Button>
                ) : (
                    <Button className="w-full justify-between" disabled>
                        <span className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            {platform.primaryLabel}
                        </span>
                        <CheckCircle2 className="h-4 w-4 opacity-50" />
                    </Button>
                )}
                {platform.secondaryHref ? (
                    <Button asChild className="w-full justify-start" variant="outline">
                        <Link href={platform.secondaryHref}>
                            <Download className="h-4 w-4" />
                            {platform.secondaryLabel}
                        </Link>
                    </Button>
                ) : (
                    <Button className="w-full justify-start" variant="outline" disabled>
                        <Download className="h-4 w-4" />
                        {platform.secondaryLabel}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
        </div>
    );
}
