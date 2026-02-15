'use client';

import { Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

const UpgradeUI = ({
    price,
    plan,
    cardHolderName,
    setCardHolderName,
    cardNumber,
    setCardNumber,
    expiry,
    setExpiry,
    cvc,
    setCvc,
    handleSubscribe
}: {
    price: string;
    plan: string;
    cardHolderName: string;
    setCardHolderName: (value: string) => void;
    cardNumber: string;
    setCardNumber: (value: string) => void;
    expiry: string;
    setExpiry: (value: string) => void;
    cvc: string;
    setCvc: (value: string) => void;
    handleSubscribe: () => void;
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
                        <div>
                            <label className="text-sm text-muted-foreground">
                                Cardholder Name
                            </label>
                            <Input
                                value={cardHolderName}
                                onChange={(e) =>
                                    setCardHolderName(e.target.value)
                                }
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">
                                Card Number
                            </label>
                            <Input
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="1234 5678 9012 3456"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm text-muted-foreground">
                                    Expiry
                                </label>
                                <Input
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm text-muted-foreground">
                                    CVC
                                </label>
                                <Input
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    placeholder="123"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleSubscribe}
                            className="w-full gap-2 cursor-pointer"
                        >
                            <Lock className="w-4 h-4" />
                            Pay ${price}
                        </Button>
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
