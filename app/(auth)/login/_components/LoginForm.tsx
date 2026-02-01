'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getFriendlyAuthMessage } from '@/helpers/authErrors';
import { useAuthUser } from '@/hooks/useAuthUser';
import { auth } from '@/lib/firebase';
import { saveUser } from '@/services/authService';
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';

export default function LoginForm() {
    const router = useRouter();
    const { user: localUser, loading } = useAuthUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailPending, startEmailTransition] = useTransition();
    const [googlePending, startGoogleTransition] = useTransition();

    useEffect(() => {
        if (!loading && localUser) {
            router.replace('/');
        }
    }, [loading, localUser, router]);

    const handleGoogle = async () => {
        startGoogleTransition(async () => {
            try {
                const provider = new GoogleAuthProvider();

                provider.setCustomParameters({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                });

                // Sign in with Google
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                if (!user.email) {
                    throw new Error('No email found in Google account.');
                }
                const name = user.displayName?.trim() || 'Google User';
                const email = user.email || '';

                const savedData = await saveUser(user, name, email);
                if (!savedData) throw new Error('Failed to save user data.');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('Google login failed:', error);

                    const firebaseError = error as {
                        code?: string;
                        message?: string;
                    };

                    if (firebaseError.code === 'auth/popup-closed-by-user') {
                        toast.error('Login cancelled by user.');
                    } else if (
                        firebaseError.code === 'auth/invalid-credential'
                    ) {
                        toast.error(
                            'Invalid credentials. Check your Google OAuth setup.',
                        );
                    } else {
                        toast.error(
                            'Google login failed. Please try again later.',
                        );
                    }
                } else {
                    console.error('Unknown error during Google login:', error);
                    toast.error('Unexpected error occurred. Please try again.');
                }
            }
        });
    };

    const handleEmailLogin = async () => {
        startEmailTransition(async () => {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success('Login successful!');
            } catch (error) {
                const message = getFriendlyAuthMessage(error);
                toast.error(message);
                console.error('Email login failed:', error);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome back!</CardTitle>
                <CardDescription>
                    Login to access your courses and continue learning.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleEmailLogin}>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-row justify-center gap-4">
                        <Button
                            disabled={googlePending}
                            onClick={handleGoogle}
                            variant="outline"
                            className="cursor-pointer"
                        >
                            {googlePending ? (
                                <>
                                    <Loader className="size-4 animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <FcGoogle className="size-4" />
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>

                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button
                            disabled={
                                emailPending ||
                                !email ||
                                !password ||
                                loading ||
                                googlePending
                            }
                            onClick={handleEmailLogin}
                            className="cursor-pointer"
                        >
                            {emailPending || googlePending ? (
                                <>
                                    <Loader className="size-4 animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                'Continue'
                            )}
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}
