'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const plans = [
    {
        name: 'Free',
        price: '0',
        features: [
            'Access to basic courses',
            'Community support',
            'Limited progress tracking',
        ],
    },
    {
        name: 'Pro',
        price: '14.99',
        features: [
            'All courses included',
            'Advanced progress tracking',
            'Personalized learning paths',
        ],
    },
    {
        name: 'Premium',
        price: '29.99',
        features: [
            'Everything in Pro',
            '1-on-1 mentorship',
            'Priority support',
            'Certificates of completion',
        ],
    },
];

const PricingSection = () => {
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
                        <Button className="mt-auto">Get Started</Button>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default PricingSection;
