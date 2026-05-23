import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Password Reset Sent | CheFu Academy',
    description: 'Check your email for CheFu Academy password reset instructions.',
};

export default async function ResetSentPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string }>;
}) {
    const { email = '' } = await searchParams;

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600">
                        <MailCheck className="size-7" />
                    </div>
                    <CardTitle className="mt-4 text-2xl">
                        Check your email
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 text-center">
                    <p className="text-sm leading-6 text-muted-foreground">
                        If {email ? <strong>{email}</strong> : 'that address'} is
                        registered, Firebase will send password reset instructions shortly.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Button asChild>
                            <Link href="/login">Back to login</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/support">Contact support</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
