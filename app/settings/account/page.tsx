'use client';

import { useAuthUser } from '@/hooks/useAuthUser';
import { getApiUrl } from '@/lib/api-url';
import { auth, storage } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
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

            await syncChefuProfilePicture(photoURL);

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

async function syncChefuProfilePicture(photoURL: string) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-chefu-app': 'academy',
    };

    if (auth.currentUser) {
        headers.Authorization = `Bearer ${await auth.currentUser.getIdToken(true)}`;
    }

    const response = await fetch(getApiUrl('/auth/profile'), {
        method: 'PATCH',
        credentials: 'include',
        headers,
        body: JSON.stringify({ profilePicture: photoURL }),
    });

    if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
            | { error?: string; message?: string; requestId?: string }
            | null;
        const requestId = data?.requestId ? ` Request ID: ${data.requestId}` : '';
        throw new Error(
            `${data?.message || data?.error || 'Unable to sync profile picture.'}${requestId}`,
        );
    }
}
