'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import UpgradeUI from '@/components/pagesUI/UpgradeUI';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useEffect, useState } from 'react';

export default function UpgradeClient() {
    const searchParams = useSearchParams();
    const price = searchParams.get('price');
    const plan = searchParams.get('plan');
    const router = useRouter();
    const { user, loading } = useAuthUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [loading, router, user]);
    if (loading) return null;
    if (!price || !plan) return null;

    const handleSubscribe = async () => {
        if (isSubmitting || !user?.email) return;
        setErrorMessage('');

        const parsedPrice = Number(price);
        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            setErrorMessage('Invalid plan price. Please refresh and try again.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan,
                    price: parsedPrice,
                    customerEmail: user.email,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create Stripe checkout session');
            }

            const data: { url?: string } = await response.json();
            if (!data.url) {
                throw new Error('Missing Stripe checkout url');
            }

            window.location.href = data.url;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Unknown error';
            setErrorMessage(`Failed to start checkout: ${message}`);
            console.error('Failed to start Stripe checkout:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <UpgradeUI
            price={price}
            plan={plan}
            handleSubscribe={handleSubscribe}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
        />
    );
}
