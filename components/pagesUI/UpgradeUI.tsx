'use client';

import { Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

const UpgradeUI = ({
    price,
    plan,
    handleSubscribe,
    isSubmitting,
    errorMessage,
}: {
    price: string;
    plan: string;
    handleSubscribe: () => void;
    isSubmitting: boolean;
    errorMessage: string;
}) => {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl">
                        Complete your payment
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Secure payment • Cancel anytime
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Plan</span>
                            <span className="font-semibold">{plan}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                Billing
                            </span>
                            <span>Monthly</span>
                        </div>

                        <Separator />

                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${price}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={handleSubscribe}
                            className="w-full gap-2 cursor-pointer"
                            disabled={isSubmitting}
                        >
                            <Lock className="w-4 h-4" />
                            {isSubmitting ? 'Redirecting...' : `Pay $${price}`}
                        </Button>

                        {errorMessage ? (
                            <p className="text-sm text-red-600" role="alert">
                                {errorMessage}
                            </p>
                        ) : null}
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        Payments are encrypted and securely processed
                    </p>
                    <div className="flex flex-row items-center gap-2">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                            Powered by CheFu Academy
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
};

export default UpgradeUI;
