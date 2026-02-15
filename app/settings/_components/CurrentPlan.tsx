'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthUser } from "@/hooks/useAuthUser";

const CurrentPlan = () => {
    const { user } = useAuthUser();
    const currentPlan = user?.subscriptionStatus || "Free";

    const handleSubscribe = () => {
        //TODO: implement the subscribe functionality here
    };

    return (
            <Card>
                <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        You are currently on the{" "}
                        <span className="font-semibold">{currentPlan}</span>{" "}
                        plan.
                    </p>

                    {!user?.member && (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleSubscribe}
                                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            >
                                Upgrade Plan
                            </Button>
                        </div>
                    )}

                    {user?.member && (
                        <div>
                            <p>
                                Your plan will expire on{" "}
                                {user?.memberUntil
                                    ? user.memberUntil
                                          .toDate()
                                          .toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

           
    );
};

export default CurrentPlan;
