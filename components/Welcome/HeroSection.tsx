import React from 'react';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative py-20">
            <div className="flex flex-col items-center text-center space-y-8">
                <Badge className="border-cyan-400" variant={'outline'}>
                    Smart Learning Starts Here
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Expand your knowledge with our courses
                </h1>
                <p className="max-w-[700px] md:text-xl text-muted-foreground">
                    Join our community of smart learners and take your skills to
                    the next level.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Link
                        className={buttonVariants({
                            size: 'lg',
                        })}
                        href="/courses"
                    >
                        Explore Courses
                    </Link>
                    <Link
                        className={buttonVariants({
                            size: 'lg',
                            variant: 'outline',
                        })}
                        href="/courses"
                    >
                        Get Started
                        <ArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
