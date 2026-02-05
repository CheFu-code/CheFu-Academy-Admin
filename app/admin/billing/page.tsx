import Header from '@/components/Shared/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    AlertTriangle,
    Banknote,
    CreditCard,
    DollarSign,
    Download,
    LineChart,
} from 'lucide-react';
import { JSX } from 'react';

const Billing = () => {
    return (
        <div className=" w-full flex flex-col gap-10">
            <div className="flex items-center justify-between">
                <Header
                    header="Billing Administration"
                    description="System-wide revenue tracking, transactions, payouts, and
                        billing configuration."
                />

                <Button className="cursor-pointer flex items-center ">
                    <Download className="h-4 w-4" /> Export Finance Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsItem
                    icon={<DollarSign className="h-6 w-6 text-green-400" />}
                    title="Total Revenue"
                    value="$182,340.22"
                    subtitle="All-time"
                />

                <AnalyticsItem
                    icon={<CreditCard className="h-6 w-6 text-blue-400" />}
                    title="Transactions (30 days)"
                    value="1,284"
                    subtitle="Successful payments"
                />

                <AnalyticsItem
                    icon={<Banknote className="h-6 w-6 text-yellow-400" />}
                    title="Pending Payouts"
                    value="$4,920.00"
                    subtitle="Instructor & partner earnings"
                />
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-purple-400" />
                        Revenue Overview
                    </h2>

                    <Button
                        variant="outline"
                    >
                        Last 30 days
                    </Button>
                </div>

                <div className="flex items-center justify-center h-48 text-gray-500">
                    <p>Revenue Chart Placeholder</p>
                </div>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Recent Transactions
                    </h2>

                    <TransactionsTable />

                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="outline"
                        >
                            View All Transactions
                        </Button>
                    </div>
                </Card>

                <Card className=" p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Billing Alerts
                    </h2>

                    <BillingAlert message="3 failed payments in the last 24 hours" />

                    <BillingAlert message="Payout provider delayed: next payout expected tomorrow" />

                    <BillingAlert message="Invoice email delivery errors" />
                </Card>
            </div>
        </div>
    );
};

export default Billing;

const AnalyticsItem = ({ icon, title, value, subtitle }:{
    icon: JSX.Element;
    title: string;
    value: string;
    subtitle: string;
}) => (
    <div className="p-4 dark:bg-gray-900 bg-primary-foreground rounded-xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold  mt-1">{value}</p>
            </div>
        </div>
        <p className="text-gray-500 text-xs">{subtitle}</p>
    </div>
);

const TransactionsTable = () => {
    const rows = [
        { id: 'TX-9812', user: 'John D.', amount: '$29', status: 'Success' },
        { id: 'TX-9811', user: 'Alice M.', amount: '$49', status: 'Success' },
        { id: 'TX-9809', user: 'David K.', amount: '$29', status: 'Failed' },
        { id: 'TX-9808', user: 'Sarah C.', amount: '$29', status: 'Pending' },
    ];

    return (
        <div className="flex flex-col gap-3">
            {rows.map((row, i) => (
                <div
                    key={i}
                    className="p-4 rounded-lg flex justify-between items-center"
                >
                    <div>
                        <p className=" font-medium">{row.id}</p>
                        <p className="text-gray-400 text-xs mt-1">{row.user}</p>
                    </div>

                    <p>{row.amount}</p>

                    <span
                        className={`text-xs px-2 py-1 rounded ${
                            row.status === 'Success'
                                ? 'bg-green-500/10 text-green-400'
                                : row.status === 'Pending'
                                  ? 'bg-yellow-500/10 text-yellow-400'
                                  : 'bg-red-500/10 text-red-400'
                        }`}
                    >
                        {row.status}
                    </span>
                </div>
            ))}
        </div>
    );
};

const BillingAlert = ({ message }: { message: string }) => (
    <div className="dark:bg-gray-800 bg-primary-foreground flex items-start gap-3 p-4 rounded-lg mb-3">
        <AlertTriangle className="h-5 w-5 text-red-400 mt-1" />
        <p className="text-sm">{message}</p>
    </div>
);
