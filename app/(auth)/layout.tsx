'use client';

import { useAuthUser } from '@/hooks/useAuthUser';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, loading } = useAuthUser();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/');
        }
    }, [loading, user, router]);
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link
                    className="flex items-center gap-2 self-center font-bold"
                    href={'/'}
                >
                    <Image
                        src="/logo.png"
                        alt="CheFu Academy"
                        width={40}
                        height={40}
                    />
                    CheFu Academy
                </Link>
                {children}

                <div className="text-balance text-center text-xs text-muted-foreground">
                    By using our app, you agree to our{' '}
                    <Link
                        href={'/terms-service'}
                        className="text-primary hover:underline font-medium"
                    >
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                        href={'/privacy-policy'}
                        className="text-primary hover:underline font-medium"
                    >
                        Privacy Policy
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}
