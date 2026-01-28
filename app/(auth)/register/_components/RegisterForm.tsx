'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function RegisterForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const name = searchParams.get('name') || '';
    const photoURL = searchParams.get('photoURL') || '';
    const [password, setPassword] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Welcome!</CardTitle>
                        <CardDescription>
                            Sign up to create your account and start learning.
                        </CardDescription>
                    </div>
                    <Avatar className="">
                        <AvatarImage
                            src={photoURL}
                            alt="User Avatar"
                            width={40}
                            height={40}
                        />
                        <AvatarFallback className="bg-muted-foreground">
                            CN
                        </AvatarFallback>
                    </Avatar>
                </div>
            </CardHeader>

            <form onSubmit={handleRegister}>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder={name || 'Your Name'}
                                value={name}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={email || 'email@example.com'}
                                value={email}
                                readOnly
                                disabled
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
                            disabled={!password || !email || !name}
                            onClick={handleRegister}
                            className="cursor-pointer"
                        >
                            <span>Continue</span>
                            <ArrowRight />
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}
