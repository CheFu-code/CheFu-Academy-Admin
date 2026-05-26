import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowRight,
    KeyRound,
    Loader2,
    Mail,
    Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginForm({
    loading,
    handleEmailLogin,
    googlePending,
    handleGoogle,
    handlePasskey,
    handleForgotPassword,
    passkeyPending,
    resetPending,
    email,
    setEmail,
    password,
    setPassword,
    emailPending,
}: {
    loading: boolean;
    handleEmailLogin: () => Promise<void>;
    googlePending: boolean;
    emailPending: boolean;
    passkeyPending: boolean;
    resetPending: boolean;
    email: string;
    password: string;
    handleGoogle: () => Promise<void>;
    handlePasskey: () => Promise<void>;
    handleForgotPassword: () => Promise<void>;
    setEmail: Dispatch<SetStateAction<string>>;
    setPassword: Dispatch<SetStateAction<string>>;
}) {
    const anyPending =
        loading || emailPending || googlePending || passkeyPending || resetPending;


    return (
        <main className="fixed inset-0 z-10 overflow-y-auto bg-background">
            <section className="grid min-h-svh bg-[radial-gradient(circle_at_15%_12%,rgba(6,182,212,0.16),transparent_26rem),radial-gradient(circle_at_78%_20%,rgba(16,185,129,0.14),transparent_24rem),linear-gradient(135deg,rgba(248,250,252,0.92),rgba(239,246,255,0.72))] p-4 text-foreground dark:bg-[radial-gradient(circle_at_15%_12%,rgba(6,182,212,0.18),transparent_26rem),radial-gradient(circle_at_78%_20%,rgba(16,185,129,0.13),transparent_24rem),linear-gradient(135deg,rgba(0,0,0,1),rgba(9,14,22,1))] sm:p-6">
                <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_430px] lg:gap-16">
                    <div className="home-fade-up hidden min-h-[680px] content-center lg:grid">
                        <Link href="/" className="mb-8 flex w-fit items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="CheFu Academy"
                                width={54}
                                height={54}
                                className="rounded-md"
                                priority
                            />
                            <div>
                                <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">
                                    CheFu Academy
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Learning workspace
                                </p>
                            </div>
                        </Link>

                        <div className="max-w-2xl space-y-6">
                            <Badge className="w-fit border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200">
                                <Sparkles className="h-3.5 w-3.5" />
                                Smart learning starts here
                            </Badge>
                            <div className="space-y-4">
                                <h1 className="max-w-xl text-5xl font-bold leading-none text-foreground">
                                    Continue building skills with a focused
                                    learning system.
                                </h1>
                                <p className="max-w-xl text-base leading-7 text-muted-foreground">
                                    Sign in to open your courses, resume lessons,
                                    practice with quizzes and flashcards, and
                                    track progress from one secure CheFu account.
                                </p>
                            </div>


                        </div>
                    </div>

                    <div className="home-fade-up mx-auto flex w-full max-w-[430px] flex-col gap-5">
                        <div className="flex items-center justify-between lg:hidden">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/logo.png"
                                    alt="CheFu Academy"
                                    width={42}
                                    height={42}
                                    className="rounded-md"
                                    priority
                                />
                                <span className="font-semibold">CheFu Academy</span>
                            </Link>
                            <Badge variant="outline">Secure login</Badge>
                        </div>

                        <Card className="overflow-hidden rounded-md border-border/70 bg-card/95 shadow-2xl shadow-slate-950/10 backdrop-blur dark:shadow-black/40">
                            <CardHeader className="space-y-3">
                                <div className="space-y-1.5">
                                    <CardTitle className="text-2xl">
                                        Welcome back
                                    </CardTitle>
                                    <CardDescription>
                                        Continue to CheFu Academy with your
                                        CheFu account.
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    void handleEmailLogin();
                                }}
                            >
                                <CardContent className="grid gap-5">
                                    {loading && (
                                        <div className="flex items-center gap-2 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-700 dark:text-cyan-200">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Checking your current session...
                                        </div>
                                    )}

                                    <div className="grid gap-3">
                                        <Button
                                            disabled={googlePending || anyPending}
                                            onClick={handleGoogle}
                                            variant="outline"
                                            className="h-11 w-full cursor-pointer justify-center"
                                            type="button"
                                        >
                                            {googlePending ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <FcGoogle className="size-4" />
                                            )}
                                            <span>
                                                {googlePending
                                                    ? 'Connecting...'
                                                    : 'Continue with Google'}
                                            </span>
                                        </Button>

                                        <Button
                                            disabled={passkeyPending || anyPending}
                                            onClick={handlePasskey}
                                            variant="outline"
                                            className="h-11 w-full cursor-pointer justify-center"
                                            type="button"
                                        >
                                            {passkeyPending ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <KeyRound className="size-4" />
                                            )}
                                            <span>
                                                {passkeyPending
                                                    ? 'Opening passkey...'
                                                    : 'Continue with passkey'}
                                            </span>
                                        </Button>
                                    </div>

                                    <div className="relative text-center text-xs font-medium text-muted-foreground after:absolute after:inset-x-0 after:top-1/2 after:z-0 after:border-t after:border-border">
                                        <span className="relative z-10 bg-card px-3">
                                            Or continue with email
                                        </span>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <div className="relative">
                                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    value={email}
                                                    onChange={(e) =>
                                                        setEmail(e.target.value)
                                                    }
                                                    autoComplete="email"
                                                    className="h-11 pl-9"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between gap-3">
                                                <Label htmlFor="password">
                                                    Password
                                                </Label>
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    size="sm"
                                                    className="h-auto px-0 py-0 text-xs"
                                                    disabled={resetPending}
                                                    onClick={() =>
                                                        void handleForgotPassword()
                                                    }
                                                >
                                                    {resetPending
                                                        ? 'Sending...'
                                                        : 'Forgot password?'}
                                                </Button>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                autoComplete="current-password"
                                                className="h-11"
                                            />
                                        </div>

                                        <Button
                                            disabled={!email || !password || anyPending}
                                            className="h-11 w-full cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700"
                                            type="submit"
                                        >
                                            {emailPending ? (
                                                <>
                                                    <Loader2 className="size-4 animate-spin" />
                                                    <span>Signing in...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Sign in</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </form>
                        </Card>

                        <div className="grid gap-3 text-center text-xs text-muted-foreground">
                            <p>
                                By using our app, you agree to our{' '}
                                <Link
                                    href="/terms-service"
                                    className="font-medium text-primary hover:underline"
                                >
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link
                                    href="/privacy-policy"
                                    className="font-medium text-primary hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
