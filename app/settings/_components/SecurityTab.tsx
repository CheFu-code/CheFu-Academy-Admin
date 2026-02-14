'use client';

import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import {
    EmailAuthProvider,
    GoogleAuthProvider,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    updatePassword,
} from 'firebase/auth';
import { useState } from 'react';
import { toast } from 'sonner';
import SecurityTabUI from './UI/SecurityTabUI';

const SecurityTab = () => {
    const [openDelete, setOpenDelete] = useState(false);
    const [openChange, setOpenChange] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingChange, setLoadingChange] = useState(false);

    // Utility: check if user has password provider linked
    const userHasPasswordProvider = () => {
        const user = auth.currentUser;
        return (
            user?.providerData.some((p) => p.providerId === 'password') ?? false
        );
    };

    // 🔹 Delete account (supports password or Google re-auth)
    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        if (!user) return toast.error('No user is logged in.');

        setLoadingDelete(true);
        try {
            if (userHasPasswordProvider()) {
                // Email/Password users -> reauth with password
                if (!deletePassword) {
                    setLoadingDelete(false);
                    return alert('Enter your password first.');
                }
                const credential = EmailAuthProvider.credential(
                    user.email!,
                    deletePassword,
                );
                await reauthenticateWithCredential(user, credential);
            } else {
                // Google users -> reauth with Google
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);
            }

            await user.delete();
            toast.success('Your account has been deleted.');
            setOpenDelete(false);
        } catch (error: unknown) {
            console.error('Error deleting account:', error);

            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/requires-recent-login':
                        toast.error('Please re-authenticate and try again.');
                        break;
                    case 'auth/wrong-password':
                        toast.error('Incorrect password.');
                        break;
                    case 'auth/too-many-requests':
                        toast.error('Too many requests. Please try again later.');
                        break;
                    case 'auth/network-request-failed':
                        toast.error('Network error. Please try again later.');
                        break;
                    case 'auth/popup-closed-by-user':
                        toast.error('Popup closed by user.');
                        break;
                    default:
                        toast.error(error.message || 'Failed to delete account.');
                }
            } else {
                toast.error('Failed to delete account.');
            }
        } finally {
            setLoadingDelete(false);
            setDeletePassword('');
        }
    }

    // 🔹 Change password (only for accounts that have password provider)
    const handleChangePassword = async () => {
        const user = auth.currentUser;
        if (!user) return alert('No user is logged in.');

        if (!userHasPasswordProvider()) {
            return alert(
                'Your account is signed in with Google. Add a password to your account first to enable password changes.',
            );
        }

        if (!currentPassword || !newPassword)
            return toast.error('Fill in both fields.');

        setLoadingChange(true);
        try {
            const credential = EmailAuthProvider.credential(
                user.email!,
                currentPassword,
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            toast.success('Your password has been updated.');
            setOpenChange(false);
            setCurrentPassword('');
            setNewPassword('');
        } catch (error: unknown) {
            console.error('Error changing password:', error);
            toast.error('Failed to change password.');
        } finally {
            setLoadingChange(false);
        }
    };

    return (
        <SecurityTabUI
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            openChange={openChange}
            setOpenChange={setOpenChange}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            deletePassword={deletePassword}
            setDeletePassword={setDeletePassword}
            loadingDelete={loadingDelete}
            loadingChange={loadingChange}
            handleDeleteAccount={handleDeleteAccount}
            handleChangePassword={handleChangePassword}
            hasPasswordProvider={userHasPasswordProvider()}
        />
    );
};

export default SecurityTab;
