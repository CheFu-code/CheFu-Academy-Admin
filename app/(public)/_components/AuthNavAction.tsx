import { buttonVariants } from '@/components/ui/button';
import { getServerSessionMeta } from '@/lib/server-session';
import Link from 'next/link';

export default async function AuthNavAction() {
    const session = await getServerSessionMeta();

    if (session) {
        return (
            <Link
                href="/courses"
                className={buttonVariants({ size: 'sm', variant: 'outline' })}
            >
                Dashboard
            </Link>
        );
    }

    return (
        <Link href="/login" className={buttonVariants({ size: 'sm' })}>
            Login
        </Link>
    );
}
