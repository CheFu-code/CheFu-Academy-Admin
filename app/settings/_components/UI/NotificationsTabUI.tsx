import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { TabsContent } from '@/components/ui/tabs';
import { Bell, CheckCheck, Loader2, ShieldCheck } from 'lucide-react';

type Prefs = {
    activity: boolean;
    general: boolean;
    marketing: boolean;
    security: boolean;
    courseReminders: boolean;
    aiCourseCompletion: boolean;
    weeklyProgressSummary: boolean;
};

const NotificationsTabUI = ({
    prefs,
    handleToggle,
    handleBulkUpdate,
    changingPrefKey,
}: {
    prefs: Prefs;
    handleToggle: (key: keyof Prefs, value: boolean) => void;
    handleBulkUpdate: (type: 'all' | 'essential') => void;
    changingPrefKey: keyof Prefs | 'bulk' | null;
}) => {
    const notificationItems: Array<{
        key: keyof Prefs;
        title: string;
        description: string;
    }> = [
        {
            key: 'activity',
            title: 'Activity Emails',
            description: 'Progress updates, completed lessons, and course milestones.',
        },
        {
            key: 'general',
            title: 'General Emails',
            description: 'Product updates, feature improvements, and account notices.',
        },
        {
            key: 'marketing',
            title: 'Marketing Emails',
            description: 'Campaigns, offers, and new content recommendations.',
        },
        {
            key: 'security',
            title: 'Security Emails',
            description: 'Sign-in alerts, password changes, and account protection notices.',
        },
        {
            key: 'courseReminders',
            title: 'Course Reminders',
            description: 'Nudges to continue active courses and keep your learning rhythm.',
        },
        {
            key: 'aiCourseCompletion',
            title: 'AI Course Completion Emails',
            description: 'Get notified when generated courses and AI learning material are ready.',
        },
        {
            key: 'weeklyProgressSummary',
            title: 'Weekly Progress Summary',
            description: 'A weekly recap of completed lessons, progress, and suggested next steps.',
        },
    ];

    const enabledCount = Object.values(prefs).filter(Boolean).length;

    return (
        <TabsContent value="notifications" className="mt-6 space-y-4">
            <Card className="border-border/60 shadow-sm">
                <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Bell className="h-4 w-4" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>
                                Configure what you want to receive by email.
                            </CardDescription>
                        </div>
                        <div className="rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                            {enabledCount}/{notificationItems.length} enabled
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={changingPrefKey !== null}
                            onClick={() => handleBulkUpdate('all')}
                        >
                            <CheckCheck className="mr-1.5 h-4 w-4" />
                            Enable All
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={changingPrefKey !== null}
                            onClick={() => handleBulkUpdate('essential')}
                        >
                            <ShieldCheck className="mr-1.5 h-4 w-4" />
                            Essential Only
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        {notificationItems.map(item => (
                            <div
                                key={item.key}
                                className="flex items-start justify-between gap-4 rounded-lg border p-3"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                                {changingPrefKey === item.key ? (
                                    <Loader2 className="mt-1 h-4 w-4 animate-spin text-muted-foreground" />
                                ) : (
                                    <Switch
                                        disabled={changingPrefKey !== null}
                                        checked={prefs[item.key]}
                                        onCheckedChange={val =>
                                            handleToggle(item.key, val)
                                        }
                                    />
                                )}
                            </div>
                        ))}
                        {changingPrefKey === 'bulk' && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating all notification preferences...
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default NotificationsTabUI;
