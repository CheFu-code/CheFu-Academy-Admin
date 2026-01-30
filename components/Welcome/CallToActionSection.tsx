'use client';

import { Button } from '@/components/ui/button';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useState } from 'react';
import { Input } from '../ui/input';
import { toast } from 'sonner';

const CallToActionSection = () => {
    const { user } = useAuthUser();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubscribe = () => {
        if (!email) return;

        // TODO: integrate with your newsletter backend / API
        toast.success('Coming soon!');
        setSubmitted(true);
        setEmail('');
    };

    return (
        <section className="py-20 bg-indigo-600 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">
                Start Your Learning Journey Today
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of smart learners who are improving their skills
                and achieving their goals. Sign up now and get instant access to
                all courses and resources.
            </p>

            {/* Newsletter subscription */}
            <div className="mt-8 max-w-md mx-auto">
                <p className="mb-4 text-lg  font-medium">
                    Subscribe to our newsletter for updates
                </p>
                {submitted ? (
                    <p className="text-green-200">Thank you for subscribing!</p>
                ) : (
                    <div className="flex gap-2">
                        <Input
                            type="email"
                            placeholder={
                                user ? user?.email : 'Enter your email'
                            }
                            value={user ? user?.email : email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            onClick={handleSubscribe}
                            className="cursor-pointer"
                            variant={'secondary'}
                        >
                            Subscribe
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CallToActionSection;
