import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowRight,
    BookOpenCheck,
    BrainCircuit,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { buttonVariants } from '../ui/button';

const HeroSection = () => {
    const stats = [
        { value: 'AI', label: 'course builder' },
        { value: '24/7', label: 'learning support' },
        { value: '80%+', label: 'mastery goals' },
    ];

    return (
        <section
            id="hero-section"
            className="relative left-1/2 min-h-[calc(88svh-4rem)] w-screen -translate-x-1/2 overflow-hidden"
        >
            <Image
                fill
                priority
                src="/artificial-intelligence-machine-learning.jpg"
                alt="AI assistant visualizing a learning path"
                className="home-hero-image object-cover"
                sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.86),rgba(0,0,0,0.58),rgba(0,0,0,0.18))]" />

            <div className="relative mx-auto flex min-h-[calc(88svh-4rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
                <div className="max-w-3xl space-y-7 text-white">
                    <Badge className="home-fade-up w-fit border-white/20 bg-white/10 text-white backdrop-blur">
                        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                        Smart Learning Starts Here
                    </Badge>

                    <div className="space-y-5">
                        <h1 className="home-fade-up text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                            CheFu Academy
                        </h1>
                        <p className="home-fade-up max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                            Build skills with guided AI courses, practical
                            lessons, quizzes, flashcards, and progress tools
                            that keep learning clear from the first click.
                        </p>
                    </div>

                    <div className="home-fade-up flex flex-col gap-3 sm:flex-row">
                        <Link
                            className={buttonVariants({
                                size: 'lg',
                                className:
                                    'bg-cyan-500 text-white hover:bg-cyan-600',
                            })}
                            href="/courses"
                        >
                            Explore Courses
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
                            Download App
                        </Link>
                    </div>

                    <div className="home-fade-up grid max-w-2xl grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="border-l border-white/20 bg-white/[0.08] px-4 py-3 backdrop-blur"
                            >
                                <p className="text-2xl font-bold text-white">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-white/70">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="home-float absolute bottom-6 right-4 hidden w-80 border border-white/15 bg-black/40 p-4 text-white shadow-2xl backdrop-blur md:block lg:right-10">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div>
                            <p className="text-sm font-semibold">
                                Today&apos;s learning path
                            </p>
                            <p className="text-xs text-white/60">
                                Structured for steady progress
                            </p>
                        </div>
                        <BrainCircuit className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div className="space-y-3 pt-4">
                        {[
                            {
                                icon: BookOpenCheck,
                                title: 'Complete lesson',
                                tone: 'text-cyan-300',
                            },
                            {
                                icon: CheckCircle2,
                                title: 'Practice quiz',
                                tone: 'text-emerald-300',
                            },
                            {
                                icon: Sparkles,
                                title: 'Review with AI tutor',
                                tone: 'text-amber-300',
                            },
                        ].map(({ icon: Icon, title, tone }) => (
                            <div
                                key={title}
                                className="flex items-center gap-3 text-sm"
                            >
                                <span className="flex size-8 items-center justify-center rounded-full bg-white/10">
                                    <Icon className={`h-4 w-4 ${tone}`} />
                                </span>
                                <span>{title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/35 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-white/70 sm:px-6 lg:px-8">
                        <span>Courses</span>
                        <span>Practice</span>
                        <span>Progress tracking</span>
                        <span>Desktop learning</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
