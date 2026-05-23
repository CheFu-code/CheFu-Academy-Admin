import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { plans } from '@/constants/Data';
import { Check } from 'lucide-react';
import Link from 'next/link';
import PricingCheckoutButton from './PricingCheckoutButton';

const PricingSection = () => {
    return (
        <section className="py-20 text-center">
            <h2 className="mb-8 text-4xl font-bold">Choose Your Plan</h2>
            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
                {plans.map((plan) => {
                    const isFreePlan = plan.price === '0' || plan.name === 'Free';

                    return (
                        <Card
                            key={plan.name}
                            className="relative flex flex-col justify-between overflow-hidden p-6"
                        >
                            {plan.name === 'Pro' && (
                                <div className="absolute right-0 top-0 rounded-bl-xl border border-gray-400/10 bg-gray-200/80 px-4 py-1 text-sm font-medium text-green-500 dark:bg-white/10">
                                    Popular
                                </div>
                            )}
                            <h3 className="mb-4 text-2xl font-bold">{plan.name}</h3>
                            <p className="mb-6 text-3xl font-extrabold">
                                ${plan.price}
                            </p>
                            <ul className="mb-6 space-y-2 text-left text-gray-700 dark:text-gray-300">
                                {plan.features.map((feature) => (
                                    <li key={feature}>
                                        <div className="flex flex-row items-center">
                                            {isFreePlan ? (
                                                <span className="mr-2" aria-hidden="true">
                                                    &bull;
                                                </span>
                                            ) : (
                                                <Check className="mr-2 size-4 text-green-500" />
                                            )}
                                            <span>{feature}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {isFreePlan ? (
                                <Link
                                    href="/courses"
                                    className={buttonVariants({
                                        className: 'mt-auto',
                                    })}
                                >
                                    Start Free
                                </Link>
                            ) : (
                                <PricingCheckoutButton planName={plan.name} />
                            )}
                        </Card>
                    );
                })}
            </div>
        </section>
    );
};

export default PricingSection;
