import { useAuthUser } from '@/hooks/useAuthUser';
import { useSignOut } from '@/hooks/useSignOut';
import { db } from '@/lib/firebase';
import countryList from 'react-select-country-list';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { toast } from 'sonner';
import ProfileTabUI from './UI/ProfileTabUI';

const ProfileTab = () => {
    const { user } = useAuthUser();
    const { loggingOut, handleLogout } = useSignOut();
    const [name, setName] = useState(user?.fullname ?? '');
    const [saving, setSaving] = useState<null | 'fullname' | 'bio' | 'country'>(
        null,
    );
    const [bio, setBio] = useState(user?.bio ?? '');
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

    const updateCountry = async (countryCode: string) => {
        if (!user) return;

        const selected = countryList()
            .getData()
            .find(c => c.value === countryCode);
        const country = selected?.label ?? countryCode;

        if (
            countryCode.trim() === (user.countryCode || '').trim() &&
            country.trim() === (user.country || '').trim()
        ) {
            toast.info('No changes to save');
            return;
        }

        setSaving('country');

        try {
            const userRef = doc(db, 'users', user.email);
            await updateDoc(userRef, {
                countryCode: countryCode.trim(),
                country: country.trim(),
            });

            window.location.reload();
            toast.success('Country updated successfully');
        } catch (err) {
            console.error('Failed to update country:', err);
            toast.error('Failed to update country');
        } finally {
            setSaving(null);
        }
    };

    return (
        <ProfileTabUI
            user={user}
            name={name}
            setName={setName}
            bio={bio}
            setBio={setBio}
            updateField={updateField}
            updateCountry={updateCountry}
            saving={saving}
            loggingOut={loggingOut}
            handleLogout={handleLogout}
        />
    );
};

export default ProfileTab;
