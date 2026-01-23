'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';

const Support = () => {
    const router = useRouter();
    const currentYear = new Date().getFullYear();

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h1
                onClick={() => router.push('/courses')}
                className="text-2xl sm:text-3xl font-bold cursor-pointer"
            >
                Support
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
                We&apos;re here to help. Find answers to common questions or
                reach out to us directly.
            </p>

            <ScrollArea className="h-[400px] sm:h-[600px] border rounded-md p-3 sm:p-4 scrollbar-none">
                <div className="space-y-3 sm:space-y-4">
                    {/* FAQ Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">
                                Frequently Asked Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="general">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        What is CheFu Academy?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            CheFu Academy is a learning platform
                                            where you can generate courses using
                                            AI and browse videos.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="app">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        Can I use CheFu Academy on multiple
                                        devices?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Yes, your account syncs across
                                            devices.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="course">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        How do I generate a course with AI?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Simple navigate to{' '}
                                            <a
                                                href="/courses/create-course"
                                                className="text-primary cursor-pointer font-semibold"
                                            >
                                                Create Course
                                            </a>{' '}
                                            page, generate a topic, and our AI
                                            will create a custom course for you.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="topic">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        What topics can I generate courses on?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            You can generate courses on a wide
                                            range of topics, from tech and
                                            business to arts and personal
                                            development. Try it out!
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="generation">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        How long does it take to generate a
                                        course?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Courses are typically generated
                                            within minutes, depending on
                                            complexity.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="videos">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        Can I upload my own video?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Currently, only admins can upload
                                            videos.{' '}
                                            <a
                                                href="mailto:chefu.inc@gmail.com"
                                                className="text-primary font-semibold cursor-pointer"
                                            >
                                                Contact support
                                            </a>{' '}
                                            if you&apos;d like to contribute
                                            content.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="offline">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        Can I save videos for offline viewing?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Currently, only pro members can save
                                            videos offline.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="language">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        Are videos available in different
                                        languages?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Most videos include subtitles or
                                            translations. Check the video
                                            description for details.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="video">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        Are the videos curated?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Yes, all videos are viewed by our
                                            team before being published.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="progress">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        Can I track my learning progress?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Yes, your progressed is saved under
                                            <a
                                                href="/courses/my-courses"
                                                className="text-primary font-semibold cursor-pointer"
                                            >
                                                {' '}
                                                My Course
                                            </a>
                                            .
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="account">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        How do I create an account?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Click on the Sign Up button on the
                                            homepage and follow the registration
                                            process. Provide a valid email
                                            address and create a strong
                                            password.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="billing">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        What payment methods do you accept?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            We accept credit cards and PayPal
                                            for premium features.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="payment">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        How do I update my payment method?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Navigate to your billing settings
                                            and select &quot;Upgrade.&quot; You
                                            can add a new card or update
                                            existing information.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="subscription">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        How do I cancel my subscription?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            You don&apos;t need to manually
                                            cancel your subscription. Your
                                            access will continue until the end
                                            of your current billing period.
                                            After that, your account will be
                                            downgraded to the free plan.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="issues">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        The app isn&apos;t working on my device.
                                        Help!
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Try clearing caches or updating your
                                            browser. Contact support if issues
                                            persist.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="technical">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        Technical issues or bugs?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            If you encounter any technical
                                            issues, please send a detailed
                                            description to chefu.inc@gmail.com
                                            and include screenshots if possible.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    {/* Contact Support */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">
                                Contact Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                                If your question isn’t answered in the FAQ,
                                reach out to us directly:
                            </p>
                            <ul className="list-disc ml-5 space-y-1 text-xs sm:text-sm text-muted-foreground">
                                <li>
                                    Email:{' '}
                                    <a
                                        className="text-blue-600"
                                        href="mailto:chefu.inc@gmail.com"
                                    >
                                        chefu.inc@gmail.com
                                    </a>
                                </li>
                                <li>Phone: +27 (60) 603-1205</li>
                                <li>
                                    Live chat is available on{' '}
                                    <a
                                        href="/support/chat"
                                        className="text-blue-600 hover:underline"
                                    >
                                        in-chat-support
                                    </a>{' '}
                                    during business hours.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>

            <p className="text-xs sm:text-sm text-muted-foreground text-center">
                © {currentYear} CheFu Academy. All rights reserved.
            </p>
        </div>
    );
};

export default Support;