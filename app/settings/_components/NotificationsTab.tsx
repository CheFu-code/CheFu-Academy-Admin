import { NotificationsTabSkeleton } from '@/components/skeletons/NotificationTabSkeleton';
import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import NotificationsTabUI from './UI/NotificationsTabUI';

type Prefs = {
    activity: boolean;
    general: boolean;
    marketing: boolean;
    security: boolean;
    courseReminders: boolean;
    aiCourseCompletion: boolean;
    weeklyProgressSummary: boolean;
};

const defaultPrefs: Prefs = {
    activity: false,
    general: false,
    marketing: false,
    security: true,
    courseReminders: true,
    aiCourseCompletion: true,
    weeklyProgressSummary: false,
};

const NotificationsTab = () => {
    const { user, loading } = useAuthUser();
    const [prefs, setPrefs] = useState<Prefs>(
        { ...defaultPrefs, ...user?.emailPreferences },
    );
    const [changingPrefKey, setChangingPrefKey] = useState<
        keyof Prefs | 'bulk' | null
    >(null);

    useEffect(() => {
        if (user?.emailPreferences) {
            setPrefs({ ...defaultPrefs, ...user.emailPreferences });
        }
    }, [user]);

    const persistPrefs = async (
        nextPrefs: Prefs,
        changingKey: keyof Prefs | 'bulk',
        rollbackPrefs: Prefs,
    ) => {
        if (!user) return;

        try {
            setChangingPrefKey(changingKey);
            setPrefs(nextPrefs);

            const userRef = doc(db, 'users', user.email);
            await updateDoc(userRef, {
                emailPreferences: nextPrefs,
            });
        } catch (err) {
            setPrefs(rollbackPrefs);
            console.error('Failed to update preference:', err);
            toast.error('Failed to update preference');
        } finally {
            setChangingPrefKey(null);
        }
    };

    const handleToggle = async (key: keyof Prefs, value: boolean) => {
        if (!user) return;
        const previousPrefs = prefs;
        const newPrefs = { ...previousPrefs, [key]: value };
        await persistPrefs(newPrefs, key, previousPrefs);
    };

    const handleBulkUpdate = async (type: 'all' | 'essential') => {
        if (!user) return;
        const previousPrefs = prefs;
        const newPrefs: Prefs =
            type === 'all'
                ? {
                    activity: true,
                    general: true,
                    marketing: true,
                    security: true,
                    courseReminders: true,
                    aiCourseCompletion: true,
                    weeklyProgressSummary: true,
                }
                : {
                    activity: true,
                    general: true,
                    marketing: false,
                    security: true,
                    courseReminders: true,
                    aiCourseCompletion: true,
                    weeklyProgressSummary: true,
                };

        await persistPrefs(newPrefs, 'bulk', previousPrefs);
        toast.success(
            type === 'all'
                ? 'All notifications enabled.'
                : 'Switched to essential notifications.',
        );
    };

    if (loading) {
        return <NotificationsTabSkeleton />;
    }

    return (
        <NotificationsTabUI
            prefs={prefs}
            handleToggle={handleToggle}
            handleBulkUpdate={handleBulkUpdate}
            changingPrefKey={changingPrefKey}
        />
    );
};

export default NotificationsTab;
