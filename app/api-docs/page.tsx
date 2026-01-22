'use client';

import Header from '@/components/Shared/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import React from 'react';

const APIDoc = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-background">
            <Header
                header="CheFu Academy SDK Documentation"
                description="Everything you need to integrate CheFu Academy into your application."
            />

            <Separator className="mt-10 mb-10" />

            {/* What is CheFu Academy */}
            <div>
                <h1 className="text-xl font-bold">What is CheFu Academy?</h1>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                    CheFu Academy is a modern, feature-rich digital learning
                    platform designed to deliver high-quality educational
                    content across multiple platforms. It provides structured
                    courses, interactive lessons, quizzes, flashcards, and
                    real-time updates through a scalable backend.
                </p>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                    The platform is available on{' '}
                    <a
                        target="_blank"
                        href="https://chefuacademy.vercel.app"
                        className="text-primary hover:underline"
                    >
                        Web
                    </a>{' '}
                    and{' '}
                    <a
                        target="_blank"
                        href="https://play.google.com/store/apps/details?id=com.chefu.chefuacademy"
                        className="text-primary hover:underline"
                    >
                        Android
                    </a>
                    , allowing learners to access content anytime, anywhere.
                </p>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                    CheFu Academy is built with scalability, performance, and
                    developer experience in mind, making it suitable for
                    startups, institutions, and independent educators.
                </p>
            </div>

            <Separator className="mt-10 mb-10" />

            {/* About the SDK */}
            <div>
                <h1 className="text-xl font-bold">
                    What is the CheFu Academy SDK?
                </h1>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                    The CheFu Academy SDK is an official JavaScript/TypeScript
                    software development kit that allows developers to interact
                    programmatically with the CheFu Academy platform.
                </p>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                    With the SDK, you can:
                </p>

                <ul className="mt-4 list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Fetch and manage courses and learning content</li>
                    <li>Access chapters, lessons, quizzes, and flashcards</li>
                    <li>Handle authentication and API keys securely</li>
                    <li>
                        Integrate CheFu Academy into web, mobile, or backend
                        applications
                    </li>
                    <li>
                        Build custom learning experiences on top of the platform
                    </li>
                </ul>
            </div>

            <Separator className="mt-10 mb-10" />

            {/* How to use the docs */}
            <div>
                <h1 className="text-xl font-bold">
                    How to use the documentation
                </h1>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                    This documentation is structured to guide you from basic
                    setup to advanced usage of the CheFu Academy SDK.
                </p>

                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        <span className="font-semibold text-foreground">
                            Getting Started
                        </span>{' '}
                        – Learn how to install the SDK, configure your API key,
                        and make your first request.
                    </p>

                    <p>
                        <span className="font-semibold text-foreground">
                            Core Concepts
                        </span>{' '}
                        – Understand how courses, chapters, lessons, and users
                        are structured within the CheFu Academy ecosystem.
                    </p>

                    <p>
                        <span className="font-semibold text-foreground">
                            API Reference
                        </span>{' '}
                        – Detailed explanations of all available SDK methods,
                        parameters, and response formats.
                    </p>

                    <p>
                        <span className="font-semibold text-foreground">
                            Examples & Use Cases
                        </span>{' '}
                        – Practical examples showing how to integrate the SDK
                        into real-world applications.
                    </p>

                    <p>
                        <span className="font-semibold text-foreground">
                            Best Practices
                        </span>{' '}
                        – Security, performance optimization, and recommended
                        patterns for production use.
                    </p>
                </div>
            </div>

            <Separator className="mt-10 mb-10" />

            {/* Who should use it */}
            <div>
                <h1 className="text-xl font-bold">Who should use this SDK?</h1>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                    The CheFu Academy SDK is ideal for:
                </p>

                <ul className="mt-4 list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Frontend developers building learning platforms</li>
                    <li>Mobile developers integrating educational content</li>
                    <li>Backend developers creating custom APIs or services</li>
                    <li>EdTech startups and institutions</li>
                    <li>
                        Independent developers experimenting with educational
                        tools
                    </li>
                </ul>
            </div>

            <Separator className="mt-10 mb-10" />

            {/* Final note */}
            <div className="pb-20">
                <h1 className="text-xl font-bold">Next steps</h1>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                    Continue to the next section to{' '}
                    <span className="text-primary">
                        learn how to install the SDK{' '}
                    </span>
                    and make your first API call. Each section builds on the
                    previous one, so we recommend following the documentation in
                    order.
                </p>
                <Button
                    onClick={() => router.push('/api-docs/installation')}
                    className="mt-2 cursor-pointer"
                    variant={'outline'}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default APIDoc;
