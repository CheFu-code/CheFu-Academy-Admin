import { CheckCircle, Rocket, Shield, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

const AboutUsUI = () => {
    return (
        <main id="about" className="min-h-screen bg-background text-foreground">
            <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
                <Badge variant={'outline'} className="mb-4">
                    About Us
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Building Technology That Empowers People
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                    We are a technology-driven company focused on creating
                    reliable, secure, and scalable digital products that solve
                    real-world problems.
                </p>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground leading-relaxed">
                        Our mission is to build high-quality software that
                        simplifies complexity, improves productivity, and
                        enables individuals and businesses to grow through
                        technology.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Our Vision</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground leading-relaxed">
                        We envision a future where technology is accessible,
                        secure, and for people ― not against them.
                    </CardContent>
                </Card>
            </section>

            <section className="bg-muted/40 py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        What We Stand For
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="pt-6 space-y-3">
                                <Rocket className="w-6 h-6 text-primary" />
                                <h3 className="font-semibold">Innovation</h3>
                                <p className="text-sm text-muted-foreground">
                                    We constantly explore new ideas and
                                    technologies to stay ahead.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-3">
                                <Shield className="w-6 h-6 text-primary" />
                                <h3>Security</h3>
                                <p className="text-sm text-muted-foreground">
                                    Security and privacy are built into
                                    everything we create.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-3">
                                <Users className="w-6 h-6 text-primary" />
                                <h3>People First</h3>
                                <p className="text-sm text-muted-foreground">
                                    Users and customers are at the core of our
                                    decisions.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-3">
                                <CheckCircle className="w-6 h-6 text-primary" />
                                <h3>Excellence</h3>
                                <p className="text-sm text-muted-foreground">
                                    We aim for high standards in design, code,
                                    and execution.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-24">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <Separator className="mb-6" />
                <p className="text-muted-foreground leading-relaxed max-w-4xl">
                    Our journey began with a simple idea: build technology that
                    is impactful, over time, this idea grew into a company focus
                    on solving real problems using modern tools, clean
                    architecture, and thoughtful design.
                    <br />
                    <br />
                    We believe great products are built by understanding users
                    deeply, iterating continuously, and never compromising on
                    quality.
                </p>
            </section>

            <section className="bg-muted/40 py-24">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-4xl font-bold">99.9%</p>
                        <p className="text-muted-foreground">Uptime</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold">10K+</p>
                        <p className="text-muted-foreground">Users</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold">24/7</p>
                        <p className="text-muted-foreground">Support</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold">Global</p>
                        <p className="text-muted-foreground">Reach</p>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-24 text-center">
                <h2 className="text-3xl font-bold">Join Us on This Journey</h2>
                <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                    Whether you&apos;re a user, partner, or developer ―
                    we&apos;re building the future together.
                </p>
            </section>
        </main>
    );
};

export default AboutUsUI;
