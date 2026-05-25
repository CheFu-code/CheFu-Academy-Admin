import { buttonVariants } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Mail, Phone, Shield } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export function generateMetadata(): Metadata {
    return {
        title: 'Privacy Policy | CheFu Academy',
        description:
            'Learn how CheFu Academy collects, uses, protects, and manages learner data.',
    };
}

const policySections = [
    {
        value: 'collection',
        title: 'Information We Collect',
        content: (
            <>
                <p className="mb-2 text-sm text-muted-foreground">
                    We may collect the following types of information:
                </p>
                <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Personal information you provide (name, email, etc.).</li>
                    <li>Usage data (how you use our platform).</li>
                    <li>Cookies and tracking technologies.</li>
                </ul>
            </>
        ),
    },
    {
        value: 'rights',
        title: 'Your Rights',
        content: (
            <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                <li>
                    <span className="font-semibold">Access:</span> Request a copy of your data.
                </li>
                <li>
                    <span className="font-semibold">Correction:</span> Update your data.
                </li>
                <li>
                    <span className="font-semibold">Deletion:</span> Delete your account/data
                    (subject to legal retention).
                </li>
            </ul>
        ),
    },
    {
        value: 'usage',
        title: 'How We Use Your Information',
        content: (
            <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                <li>To provide and maintain our services.</li>
                <li>To improve user experience.</li>
                <li>For analytics and monitoring.</li>
                <li>To communicate important updates and announcements.</li>
            </ul>
        ),
    },
    {
        value: 'sharing',
        title: 'Sharing & Disclosure',
        content: (
            <>
                <p className="mb-2 text-sm text-muted-foreground">
                    We do not sell your personal information. We may share information:
                </p>
                <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>With service providers to help operate our platform.</li>
                    <li>When required by law or legal processes.</li>
                    <li>To protect our rights or the safety of others.</li>
                </ul>
            </>
        ),
    },
    {
        value: 'security',
        title: 'Data Security',
        content: (
            <p className="text-sm text-muted-foreground">
                We implement industry-standard measures to protect your data from
                unauthorized access, disclosure, or destruction. However, no method of
                transmission over the internet or electronic storage is 100% secure.
            </p>
        ),
    },
    {
        value: 'marketing',
        title: 'Marketing Communications',
        content: (
            <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                <li>We send updates with an opt-out option.</li>
                <li>
                    You can manage <Link href="/settings/account" className="text-primary">email preferences</Link>{' '}
                    in settings.
                </li>
            </ul>
        ),
    },
    {
        value: 'cookies',
        title: 'Cookies & Tracking',
        content: (
            <p className="text-sm text-muted-foreground">
                We use cookies and similar technologies to enhance your experience,
                analyze usage, and provide personalized content.
            </p>
        ),
    },
    {
        value: 'links',
        title: 'Links to Other Sites',
        content: (
            <p className="text-sm text-muted-foreground">
                CheFu Academy may link to external sites. We are not responsible for
                their policies.
            </p>
        ),
    },
    {
        value: 'children',
        title: "Children's Privacy",
        content: (
            <p className="text-sm text-muted-foreground">
                Our services are not intended for children under 13. We do not knowingly
                collect personal information from children.
            </p>
        ),
    },
    {
        value: 'changes',
        title: 'Changes to Privacy Policy',
        content: (
            <p className="text-sm text-muted-foreground">
                We may update this Privacy Policy from time to time. Continued use of our
                services constitutes acceptance of any changes.
            </p>
        ),
    },
    {
        value: 'contact',
        title: 'Contact Us',
        content: (
            <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                <li>Email: support@chefuinc.com</li>
                <li>Phone: +27 (60) 603-1205</li>
                <li>Address: 145 CheFu Street, Dinga, Limpopo, South Africa</li>
            </ul>
        ),
    },
];

const PrivacyPolicy = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
            <Link
                href="/courses"
                className={buttonVariants({
                    variant: 'ghost',
                    className: 'w-fit',
                })}
            >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Courses
            </Link>

            <Card className="border-border/60 bg-linear-to-br from-blue-500/10 via-indigo-500/5 to-transparent">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl sm:text-3xl">
                        <Shield className="h-6 w-6" />
                        Privacy Policy
                    </CardTitle>
                    <CardDescription>
                        Last updated: January 18, 2026
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        Your privacy is important to us. This policy explains how we
                        collect, use, and protect your information when you use CheFu
                        Academy.
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr]">
                <Card className="border-border/60">
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Contact</CardTitle>
                        <CardDescription>
                            Reach out if you have privacy or data-related questions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 rounded-lg border p-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href="mailto:support@chefuinc.com" className="text-primary hover:underline">
                                support@chefuinc.com
                            </a>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border p-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">+27 (60) 603-1205</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Policy Details</CardTitle>
                        <CardDescription>
                            Expand each section to review details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y rounded-md border">
                            {policySections.map(section => (
                                <details
                                    key={section.value}
                                    className="group p-4 open:bg-muted/30"
                                >
                                    <summary className="cursor-pointer list-none font-medium">
                                        {section.title}
                                    </summary>
                                    <div className="mt-3">{section.content}</div>
                                </details>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
