'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { plans } from '@/constants/Data';
import { useRouter } from 'next/navigation';

const PricingSection = () => {
    const router = useRouter();

    return (
        <section className="py-20  text-center">
            <h2 className="text-4xl font-bold mb-8">Choose Your Plan</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, i) => (
                    <Card key={i} className="p-6 flex flex-col justify-between">
                        <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                        <p className="text-3xl font-extrabold mb-6">
                            ${plan.price}
                        </p>
                        <ul className="mb-6 text-gray-700 text-left space-y-2">
                            {plan.features.map((feature, j) => (
                                <li key={j}>• {feature}</li>
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
                            Get Started
                        </Button>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default PricingSection;
