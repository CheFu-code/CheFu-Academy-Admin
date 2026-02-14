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
import { Loader } from 'lucide-react';
import { KeyRound } from 'lucide-react'; // new icon
import { Dispatch, SetStateAction } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginForm({
    loading,
    handleEmailLogin,
    googlePending,
    handleGoogle,
    handlePasskey, // ✅ add this
    passkeyPending, // ✅ add this
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
    passkeyPending: boolean;               // ✅ new
    email: string;
    password: string;
    handleGoogle: () => Promise<void>;
    handlePasskey: () => Promise<void>;    // ✅ new
    setEmail: Dispatch<SetStateAction<string>>;
    setPassword: Dispatch<SetStateAction<string>>;
}) {
    const anyPending = loading || emailPending || googlePending || passkeyPending;

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
                            disabled={googlePending || anyPending}
                            onClick={handleGoogle}
                            variant="outline"
                            className="cursor-pointer"
                            type="button"
                        >
                            {googlePending ? (
                                <>
                                    <Loader className="size-4 animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <FcGoogle className="size-4" />
                                    <span>Google</span>
                                </>
                            )}
                        </Button>

                        {/* ✅ Passkey sign-in button */}
                        <Button
                            disabled={passkeyPending || anyPending}
                            onClick={handlePasskey}
                            variant="outline"
                            className="cursor-pointer"
                            type="button"
                        >
                            {passkeyPending ? (
                                <>
                                    <Loader className="size-4 animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <KeyRound className="size-4" />
                                    <span>Passkey</span>
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
                                autoComplete="email"
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
                                autoComplete="current-password"
                            />
                        </div>
                        <Button
                            disabled={!email || !password || anyPending}
                            onClick={handleEmailLogin}
                            className="cursor-pointer"
                            type="submit"
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
