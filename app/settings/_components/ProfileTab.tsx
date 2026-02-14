import { useAuthUser } from '@/hooks/useAuthUser';
import { useSignOut } from '@/hooks/useSignOut';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProfileTabUI from './UI/ProfileTabUI';

const ProfileTab = () => {
    const { user } = useAuthUser();
    const { loggingOut, handleLogout } = useSignOut();
    const [name, setName] = useState(user?.fullname ?? '');
    const [saving, setSaving] = useState<null | 'fullname' | 'bio'>(null);
    const [bio, setBio] = useState(user?.bio ?? '');
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

    if (!user) return null;

    const updateField = async (field: 'fullname' | 'bio', value: string) => {
        if (!user) return;

        if (value.trim() === user[field]) {
            toast.info(`No changes to save`);
            return;
        }

        setSaving(field);

        try {
            const userRef = doc(db, 'users', user.email);
            await updateDoc(userRef, { [field]: value.trim() });

            window.location.reload();
            toast.success(
                `${field === 'fullname' ? 'Name' : 'Bio'} updated successfully`,
            );
        } catch (err) {
            console.error(`Failed to update ${field}:`, err);
            toast.error(`Failed to update ${field}`);
        } finally {
            setSaving(null);
        }
    };

    const handleToggle = async (key: keyof typeof prefs, value: boolean) => {
        try {
            // Update local state
            setPrefs((prev) => ({ ...prev, [key]: value }));

            // Update Firestore
            const userRef = doc(db, 'users', user.email);
            await updateDoc(userRef, {
                emailPreferences: {
                    ...prefs,
                    [key]: value,
                },
            });
        } catch (err) {
            console.error('Failed to update preference:', err);
        }
    };

    return (
        <ProfileTabUI
            user={user}
            name={name}
            setName={setName}
            bio={bio}
            setBio={setBio}
            prefs={prefs}
            handleToggle={handleToggle}
            updateField={updateField}
            saving={saving}
            loggingOut={loggingOut}
            handleLogout={handleLogout}
        />
    );
};

export default ProfileTab;
