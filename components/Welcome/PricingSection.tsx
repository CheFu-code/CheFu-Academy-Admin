'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { plans } from '@/constants/Data';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PricingSection = () => {
    const router = useRouter();

    return (
        <section className="py-20  text-center">
            <h2 className="text-4xl font-bold mb-8">Choose Your Plan</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, i) => (
                    <Card
                        key={i}
                        className="p-6 relative overflow-hidden flex flex-col justify-between"
                    >
                        {plan.name === 'Pro' && (
                            <div className="absolute top-0 right-0 px-4 py-1 bg-white/10 rounded-bl-xl text-sm font-medium text-green-500 border border-gray-400/10">
                                Popular
                            </div>
                        )}
                        <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                        <p className="text-3xl font-extrabold mb-6">
                            ${plan.price}
                        </p>
                        <ul className="mb-6 text-gray-700 text-left space-y-2">
                            {plan.features.map((feature, j) => (
                                <li key={j}>
                                    <div className="flex flex-row items-center">
                                        {plan.name !== 'Free' ? (
                                            <Check className="size-4 text-green-500 mr-1" />
                                        ) : (
                                            <div className="mr-1">•</div>
                                        )}
                                        {feature}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Button
                            onClick={() => {
                                if (
                                    plan.price === '0' ||
                                    plan.name === 'Free'
                                ) {
                                    router.push('/courses');
                                } else {
                                    router.push(
                                        `/upgrade?price=${plan.price}&plan=${plan.name}`,
                                    );
                                }
                            }}
                            className="mt-auto cursor-pointer"
                        >
                            {plan.name === 'Free'
                                ? 'Start Free'
                                : 'Get Started'}
                        </Button>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default PricingSection;
