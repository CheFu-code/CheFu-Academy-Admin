import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BillingHistory from '../_components/BillingHistory';
import CurrentPlan from '../_components/CurrentPlan';

const BillingPage = () => {
    return (
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
            <Card>
                <CardHeader className="space-y-3">
                    <Badge variant="secondary" className="w-fit">
                        Billing Center
                    </Badge>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl sm:text-3xl">
                            Billing & Subscription
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Manage your subscription plan, review payment history,
                            and keep your account billing up to date.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <Card className="bg-muted/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Plan</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Manage upgrades and renewals.
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Payments</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Track billing records and statuses.
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Security</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Keep account billing details safe.
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <div className="space-y-4">
                <CurrentPlan />
                <BillingHistory />
            </div>
        </div>
    );
};

export default BillingPage;
