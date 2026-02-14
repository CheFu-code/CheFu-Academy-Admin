'use client';

import { auth } from '@/lib/firebase';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from 'firebase/auth';
import { useState } from 'react';
import SecurityTabUI from './UI/SecurityTabUI';

const SecurityTab = () => {
    // states for modals + inputs
    const [openDelete, setOpenDelete] = useState(false);
    const [openChange, setOpenChange] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingChange, setLoadingChange] = useState(false);

    // 🔹 Delete account
    const handleDeleteAccount = async () => {
        const user = auth.currentUser;

        if (!user) return alert('No user is logged in.');
        if (!deletePassword) return alert('Enter your password first.');

        setLoadingDelete(true);
        try {
            const credential = EmailAuthProvider.credential(
                user.email!,
                deletePassword,
            );
            await reauthenticateWithCredential(user, credential);
            await user.delete();
            alert('Your account has been deleted.');
            setOpenDelete(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error deleting account:', error);
                alert(error.message || 'Failed to delete account.');
            } else {
                console.error('Unexpected error:', error);
                alert('Failed to delete account.');
            }
        } finally {
            setLoadingDelete(false);
            setDeletePassword('');
        }
    };

    // 🔹 Change password
    const handleChangePassword = async () => {
        const user = auth.currentUser;

        if (!user) return alert('No user is logged in.');
        if (!currentPassword || !newPassword)
            return alert('Fill in both fields.');

        setLoadingChange(true);
        try {
            const credential = EmailAuthProvider.credential(
                user.email!,
                currentPassword,
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            alert('Your password has been updated.');
            setOpenChange(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error updating password:', error);
                alert(error.message || 'Failed to change password.');
            } else {
                console.error('Unexpected error:', error);
                alert('Failed to change password.');
            }
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
        />
    );
};

export default SecurityTab;
