'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getApiUrl } from '@/lib/api-url';
import { BillingStatusResponse } from '@/types/billing';
import { CalendarClock, CreditCard, ExternalLink, ReceiptText, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const moneyFormatter = (currency: string, value: string) =>
    new Intl.NumberFormat('en', {
        currency: currency || 'USD',
        style: 'currency',
    }).format(Number(value || 0));

const dateFormatter = (value: string | null) => {
    if (!value) return 'Not set';

    return new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
    }).format(new Date(value));
};

const statusVariant = (status: string) => {
    const normalized = status.toLowerCase();

    if (['active', 'paid', 'completed', 'trialing'].includes(normalized)) {
        return 'default' as const;
    }

    if (['free', 'pending'].includes(normalized)) return 'secondary' as const;

    return 'destructive' as const;
};

const BillingCenter = () => {
    const [billingData, setBillingData] = useState<BillingStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState<'checkout' | 'portal' | null>(null);

    useEffect(() => {
        let active = true;

        const loadBilling = async () => {
            try {
                const response = await fetch(getApiUrl('/billing/status'), {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to load billing details.');
                }

                const data = (await response.json()) as BillingStatusResponse;

                if (active) {
                    setBillingData(data);
                }
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Billing details could not be loaded.',
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadBilling();

        return () => {
            active = false;
        };
    }, []);

    const openBillingAction = async (type: 'checkout' | 'portal') => {
        setAction(type);

        try {
            const response = await fetch(getApiUrl(`/billing/${type}`), {
                credentials: 'include',
                method: 'POST',
            });
            const payload = (await response.json()) as { message?: string; url?: string };

            if (!response.ok || !payload.url) {
                throw new Error(payload.message || 'Billing action is not configured yet.');
            }

            window.location.assign(payload.url);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Unable to open Clerk billing right now.',
            );
        } finally {
            setAction(null);
        }
    };

    if (loading) {
        return (
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
        );
    }

    const billing = billingData?.billing;
    const history = billingData?.history || [];
    const planName = billing?.planName || 'Free';
    const isMember = Boolean(billing?.member);

    return (
        <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <Card className="overflow-hidden">
                    <CardHeader className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <CardTitle>Current Plan</CardTitle>
                                <CardDescription>
                                    Clerk Billing powers plan changes, renewals, and invoices.
                                </CardDescription>
                            </div>
                            <Badge variant={statusVariant(billing?.status || 'free')}>
                                {billing?.status || 'free'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="rounded-lg border bg-muted/35 p-4">
                            <p className="text-sm text-muted-foreground">Active plan</p>
                            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <p className="text-3xl font-semibold">{planName}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {isMember
                                            ? `Renews or expires on ${dateFormatter(
                                                  billing?.memberUntil || null,
                                              )}`
                                            : 'Upgrade to unlock paid learning features.'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={() => openBillingAction('checkout')}
                                        disabled={action !== null}
                                    >
                                        <CreditCard className="mr-2 size-4" />
                                        {isMember ? 'Change Plan' : 'Upgrade Plan'}
                                    </Button>
                                    <Button
                                        onClick={() => openBillingAction('portal')}
                                        disabled={action !== null}
                                        variant="outline"
                                    >
                                        <ExternalLink className="mr-2 size-4" />
                                        Manage Billing
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-lg border p-3">
                                <ShieldCheck className="mb-2 size-4 text-emerald-500" />
                                <p className="text-sm font-medium">Provider</p>
                                <p className="text-sm text-muted-foreground">
                                    {billing?.provider || 'clerk'}
                                </p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <CalendarClock className="mb-2 size-4 text-sky-500" />
                                <p className="text-sm font-medium">Last synced</p>
                                <p className="text-sm text-muted-foreground">
                                    {dateFormatter(billing?.updatedAt || null)}
                                </p>
                            </div>
                            <div className="rounded-lg border p-3">
                                <ReceiptText className="mb-2 size-4 text-violet-500" />
                                <p className="text-sm font-medium">Invoices</p>
                                <p className="text-sm text-muted-foreground">
                                    {history.length} record{history.length === 1 ? '' : 's'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Billing Security</CardTitle>
                        <CardDescription>
                            Payments happen inside Clerk. CheFu only stores the subscription
                            status needed to unlock features.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>Card details are handled by Clerk and its payment processor.</p>
                        <p>Webhook signatures are verified on the CheFu API before plan changes are saved.</p>
                        <p>Use Manage Billing to update payment methods, invoices, and cancellation.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                        Synced from Clerk payment events received by your API.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {history.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                            No billing history yet. Your first successful Clerk payment will
                            appear here after the webhook syncs.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((payment) => (
                                    <TableRow key={payment.orderID}>
                                        <TableCell>{dateFormatter(payment.timestamp)}</TableCell>
                                        <TableCell>{payment.planType}</TableCell>
                                        <TableCell>
                                            {moneyFormatter(
                                                payment.amount.currency_code,
                                                payment.amount.value,
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant(payment.status)}>
                                                {payment.status.toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BillingCenter;
