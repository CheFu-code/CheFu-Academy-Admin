import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { useAuthUser } from "@/hooks/useAuthUser";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const NotificationsTab = () => {
    const { user, loading } = useAuthUser()
    const [changingPref, setChangingPref] = useState(false)
    const [prefs, setPrefs] = useState(
        user?.emailPreferences ?? {
            activity: false,
            general: false,
            marketing: false,
            security: true,
        },
    );

    useEffect(() => {
        if (user?.emailPreferences) {
            setPrefs(user.emailPreferences);
        }
    }, [user]);

    const handleToggle = async (key: keyof typeof prefs, value: boolean) => {
        try {
            setChangingPref(true)
            setPrefs((prev) => ({ ...prev, [key]: value }));
            if (!user) return null;

            const userRef = doc(db, 'users', user.email);
            await updateDoc(userRef, {
                emailPreferences: {
                    ...prefs,
                    [key]: value,
                },
            });
        } catch (err) {
            console.error('Failed to update preference:', err);
            toast.error('Failed to update preference');
        } finally {
            setPrefs((prev) => ({ ...prev, [key]: value }));
            setChangingPref(false)
        }
    };
    return (
        <TabsContent value="notifications" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                        Manage your learning updates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Preferences */}
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground">
                            Preferences
                        </h3>
                        <div className="grid gap-1 sm:gap-2 mt-1 sm:mt-2">
                            {prefs &&
                                (
                                    [
                                        'activity',
                                        'general',
                                        'marketing',
                                        'security',
                                    ] as const
                                ).map((key) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between text-xs sm:text-sm"
                                    >
                                        <span>{`${key.charAt(0).toUpperCase() +
                                            key.slice(1)
                                            } Emails`}</span>
                                        {changingPref && key === 'security' ?
                                            <Loader2 className="animate-pulse" /> :
                                            <Switch
                                                disabled={changingPref}
                                                checked={prefs[key]}
                                                onCheckedChange={(val) =>
                                                    handleToggle(key, val)
                                                }
                                            />}
                                    </div>
                                ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default NotificationsTab;
