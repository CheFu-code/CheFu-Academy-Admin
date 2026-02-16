'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ArrowLeft,
    CircleHelp,
    Mail,
    MessageCircle,
    Phone,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const faqItems = [
    {
        value: 'general',
        question: 'What is CheFu Academy?',
        answer:
            'CheFu Academy is a learning platform where you can generate courses using AI and browse videos.',
    },
    {
        value: 'app',
        question: 'Can I use CheFu Academy on multiple devices?',
        answer: 'Yes, your account syncs across devices.',
    },
    {
        value: 'course',
        question: 'How do I generate a course with AI?',
        answer:
            'Go to Create Course, generate a topic, and our AI will create a custom course for you.',
    },
    {
        value: 'topic',
        question: 'What topics can I generate courses on?',
        answer:
            'You can generate courses on a wide range of topics, from tech and business to arts and personal development.',
    },
    {
        value: 'generation',
        question: 'How long does it take to generate a course?',
        answer: 'Courses are typically generated within minutes, depending on complexity.',
    },
    {
        value: 'videos',
        question: 'Can I upload my own video?',
        answer:
            'Currently, only admins can upload videos. Contact support if you would like to contribute content.',
    },
    {
        value: 'offline',
        question: 'Can I save videos for offline viewing?',
        answer: 'Currently, only Pro members can save videos offline.',
    },
    {
        value: 'language',
        question: 'Are videos available in different languages?',
        answer:
            'Most videos include subtitles or translations. Check each video description for details.',
    },
    {
        value: 'video',
        question: 'Are the videos curated?',
        answer: 'Yes, all videos are reviewed by our team before being published.',
    },
    {
        value: 'progress',
        question: 'Can I track my learning progress?',
        answer: 'Yes, your progress is saved under My Courses.',
    },
    {
        value: 'account',
        question: 'How do I create an account?',
        answer:
            'Click Sign Up on the homepage and follow the registration process using a valid email and strong password.',
    },
    {
        value: 'billing',
        question: 'What payment methods do you accept?',
        answer: 'We accept credit cards and PayPal for premium features.',
    },
    {
        value: 'payment',
        question: 'How do I update my payment method?',
        answer:
            'Go to billing settings and select Upgrade to add a new card or update existing payment details.',
    },
    {
        value: 'subscription',
        question: 'How do I cancel my subscription?',
        answer:
            'You do not need to manually cancel. Access continues until your current billing period ends, then your account downgrades to Free.',
    },
    {
        value: 'issues',
        question: "The app isn't working on my device. Help!",
        answer:
            'Try clearing cache or updating your browser. Contact support if issues persist.',
    },
    {
        value: 'technical',
        question: 'Technical issues or bugs?',
        answer:
            'Send a detailed description to support@chefuinc.com and include screenshots when possible.',
    },
];

const Support = () => {
    const router = useRouter();
    const currentYear = new Date().getFullYear();

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
            <Button variant="ghost" className="w-fit" onClick={() => router.push('/courses')}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Courses
            </Button>

            <Card className="border-border/60 bg-linear-to-br from-indigo-500/10 via-sky-500/5 to-transparent">
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl">Support Center</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Find answers quickly, then contact us directly if you still need help.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Mail className="h-4 w-4" />
                            Email
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link className="text-sm text-primary hover:underline" href="mailto:support@chefuinc.com">
                            support@chefuinc.com
                        </Link>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Phone className="h-4 w-4" />
                            Phone
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">+27 (60) 603-1205</p>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <MessageCircle className="h-4 w-4" />
                            Live Chat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link className="text-sm text-primary hover:underline" href="/support/chat">
                            Open in-chat support
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/60 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <CircleHelp className="h-5 w-5" />
                        Frequently Asked Questions
                    </CardTitle>
                    <CardDescription>
                        Expand a question to view the answer.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible>
                        {faqItems.map(item => (
                            <AccordionItem key={item.value} value={item.value}>
                                <AccordionTrigger className="text-sm sm:text-base">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground sm:text-sm">
                Copyright {currentYear} CheFu Academy. All rights reserved.
            </p>
        </div>
    );
};

export default Support;
