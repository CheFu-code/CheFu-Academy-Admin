export type BillingHistoryItem = {
    amount: {
        currency_code: string;
        value: string;
    };
    email: string;
    orderID: string;
    payerID: string;
    payerName: {
        given_name: string;
        surname: string;
    };
    planType: string;
    status: string;
    timestamp: string;
};

export type BillingStatusResponse = {
    billing: {
        customerId: string | null;
        member: boolean;
        memberUntil: string | null;
        planId: string | null;
        planName: string;
        provider: string;
        status: string;
        subscriptionId: string | null;
        updatedAt: string | null;
    };
    history: BillingHistoryItem[];
};
