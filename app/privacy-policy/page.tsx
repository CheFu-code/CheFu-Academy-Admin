import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const PrivacyPolicy = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm">
                Last updated: September 3, 2025
            </p>

            <ScrollArea className="h-[600px] border rounded-md p-4">
                <div className="space-y-4">
                    {/* Introduction */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Introduction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Your privacy is important to us. This Privacy
                                Policy explains how we collect, use, and protect
                                your information when you use our services.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Information Collection */}
                    <Accordion type="single" collapsible>
                        <AccordionItem value="collection">
                            <AccordionTrigger>
                                Information We Collect
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    We may collect the following types of
                                    information:
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        Personal information you provide (name,
                                        email, etc.).
                                    </li>
                                    <li>
                                        Usage data (how you use our platform).
                                    </li>
                                    <li>Cookies and tracking technologies.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="rights">
                            <AccordionTrigger>Your Rights</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        <span className="font-semibold">
                                            Access
                                        </span>
                                        : Request a copy of your data
                                    </li>
                                    <li>
                                        <span className="font-semibold">
                                            Correction
                                        </span>
                                        : Update your data
                                    </li>
                                    <li>
                                        <span className="font-semibold">
                                            Deletion
                                        </span>
                                        : Delete your account/data (subject to
                                        legal retention)
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* How Information is Used */}
                        <AccordionItem value="usage">
                            <AccordionTrigger>
                                How We Use Your Information
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        To provide and maintain our services.
                                    </li>
                                    <li>To improve user experience.</li>
                                    <li>For analytics and monitoring.</li>
                                    <li>
                                        To communicate important updates and
                                        announcements.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Sharing and Disclosure */}
                        <AccordionItem value="sharing">
                            <AccordionTrigger>
                                Sharing & Disclosure
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    We do not sell your personal information. We
                                    may share information:
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        With service providers to help operate
                                        our platform.
                                    </li>
                                    <li>
                                        When required by law or legal processes.
                                    </li>
                                    <li>
                                        To protect our rights or the safety of
                                        others.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Security */}
                        <AccordionItem value="security">
                            <AccordionTrigger>Data Security</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground">
                                    We implement industry-standard measures to
                                    protect your data from unauthorized access,
                                    disclosure, or destruction. However, no
                                    method of transmission over the internet or
                                    electronic storage is 100% secure.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="marketing">
                            <AccordionTrigger>
                                Marketing Communications
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        We&apos;ll send updates with opt-out
                                        option
                                    </li>
                                    <li>
                                        You can manage{' '}
                                        <a className='text-primary' href="/settings/account">
                                            email preferences
                                        </a>{' '}
                                        in settings
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Cookies */}
                        <AccordionItem value="cookies">
                            <AccordionTrigger>
                                Cookies & Tracking
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground">
                                    We use cookies and similar technologies to
                                    enhance your experience, analyze usage, and
                                    provide personalized content.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="links">
                            <AccordionTrigger>
                                Links to Other Sites
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground">
                                    CheFu Academy may link to external sites. We
                                    are not responsible for their policies.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Children */}
                        <AccordionItem value="children">
                            <AccordionTrigger>
                                Children&apos;s Privacy
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground">
                                    Our services are not intended for children
                                    under 13. We do not knowingly collect
                                    personal information from children.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Changes */}
                        <AccordionItem value="changes">
                            <AccordionTrigger>
                                Changes to Privacy Policy
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground">
                                    We may update this Privacy Policy from time
                                    to time. Continued use of our services
                                    constitutes acceptance of any changes.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Contact */}
                        <AccordionItem value="contact">
                            <AccordionTrigger>Contact Us</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground">
                                    For any questions regarding this Privacy
                                    Policy:
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>Email: chefu.inc@gmail.com</li>
                                    <li>Phone: +27 (60) 603 - 1205</li>
                                    <li>
                                        Address: 145 CheFu Street, Dinga,
                                        Limpopo, South Africa
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </ScrollArea>

            <p className="text-sm text-muted-foreground text-center">
                © {currentYear} CheFu Academy. All rights reserved.
            </p>
        </div>
    );
};

export default PrivacyPolicy;
