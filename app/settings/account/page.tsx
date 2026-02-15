'use client';

import { useAuthUser } from '@/hooks/useAuthUser';
import { auth, db, storage } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import AccountUI from '../_components/UI/AccountUI';
import AccountSkeleton from '@/components/skeletons/AccountSkeleton';

const Account = () => {
    const { user, loading } = useAuthUser();
    const [changing, setChanging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChangeAvatar = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            toast.error('Image must be under 4MB');
            return;
        }

        setChanging(true);
        try {
            const avatarRef = ref(
                storage,
                `avatars/${user.uid}.${file.name.split('.').pop()}`,
            );

            await uploadBytes(avatarRef, file);
            const photoURL = await getDownloadURL(avatarRef);

            await updateDoc(doc(db, 'users', user.email), {
                profilePicture: photoURL,
                updatedAt: new Date(),
            });

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    photoURL,
                });
            }

            toast.success('Profile picture updated!');
            window.location.reload();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update profile picture');
        } finally {
            setChanging(false);
        }
    };

    if (loading) {
        return <AccountSkeleton />;
    }

    if (!user) {
        return (
            <div className="container mx-auto max-w-4xl p-4 sm:p-6">
                <p className="text-sm text-muted-foreground">Unable to load account data.</p>
            </div>
        );
    }
    return (
        <AccountUI
            handleAvatarUpload={handleAvatarUpload}
            handleChangeAvatar={handleChangeAvatar}
            user={user}
            changing={changing}
            fileInputRef={fileInputRef}
        />
    );
};

export default Account;
