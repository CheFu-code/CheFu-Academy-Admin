import { buttonVariants } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';

const CallToActionSection = () => {
    return (
        <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-24 text-white">
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
                <p className="text-sm font-semibold uppercase text-cyan-200">
                    Start with one focused session
                </p>
                <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
                    Turn your next idea into a guided course you can actually
                    finish.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75">
                    Explore courses, practice what you learn, and keep your
                    progress synced across web and desktop.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        className={buttonVariants({
                            size: 'lg',
                            className:
                                'bg-cyan-500 text-white hover:bg-cyan-600',
                        })}
                        href="/courses"
                    >
                        Browse Courses
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        className={buttonVariants({
                            size: 'lg',
                            variant: 'outline',
                            className:
                                'border-white/30 bg-white/10 text-white hover:bg-white hover:text-foreground',
                        })}
                        href="/downloads"
                    >
                        <Download className="h-4 w-4" />
                        Get Desktop App
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToActionSection;
