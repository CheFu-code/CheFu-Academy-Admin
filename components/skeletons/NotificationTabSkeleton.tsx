import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { TabsContent } from "../ui/tabs";

export const NotificationsTabSkeleton = () => {
    return (
        <TabsContent value="notifications" className="mt-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-1 sm:space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="grid gap-3 mt-2">
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between"
                                >
                                    <Skeleton className="h-4 w-28 sm:w-40" />
                                    <Skeleton className="h-6 w-11 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};
