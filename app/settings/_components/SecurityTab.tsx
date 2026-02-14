'use client';

import { auth } from '@/lib/firebase';
import { isPasskeyReady, registerPasskey, toPasskeyMessage } from '@/lib/passkeys';
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
    const [loadingPasskey, setLoadingPasskey] = useState(false);

    // Utility: check if user has password provider linked
    const userHasPasswordProvider = () => {
        const user = auth.currentUser;
        return (
            user?.providerData.some((p) => p.providerId === 'password') ?? false
        );
    };

    const reauthenticateSensitiveAction = async (
        user: NonNullable<typeof auth.currentUser>,
        password?: string,
    ) => {
        if (userHasPasswordProvider()) {
            if (!password) {
                throw new Error('reauth-password-required');
            }
            const credential = EmailAuthProvider.credential(user.email!, password);
            await reauthenticateWithCredential(user, credential);
            return;
        }

        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
    };

    // 🔹 Delete account (supports password or Google re-auth)
    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        if (!user) return toast.error('No user is logged in.');

        setLoadingDelete(true);
        try {
            if (!deletePassword && userHasPasswordProvider()) {
                setLoadingDelete(false);
                return alert('Enter your password first.');
            }
            await reauthenticateSensitiveAction(user, deletePassword);

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
            await reauthenticateSensitiveAction(user, currentPassword);
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

    const handleEnrollPasskey = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast.error('No user is logged in.');
            return;
        }

        setLoadingPasskey(true);
        try {
            let reauthPassword: string | undefined;
            if (userHasPasswordProvider()) {
                const value = window
                    .prompt('Enter your current password to enroll a passkey.')
                    ?.trim();
                if (!value) {
                    toast.error(
                        'Passkey enrollment cancelled. Re-authentication is required.',
                    );
                    return;
                }
                reauthPassword = value;
            }

            await reauthenticateSensitiveAction(user, reauthPassword);

            const ready = await isPasskeyReady();
            if (!ready) {
                toast.error('Passkeys are not supported on this device/browser.');
                return;
            }

            const ok = await registerPasskey(user.uid, user.email || user.uid);
            if (!ok) {
                toast.error('Passkey enrollment failed.');
                return;
            }

            toast.success('Passkey enrolled successfully.');
        } catch (error: unknown) {
            console.error('Error enrolling passkey:', error);
            toast.error(toPasskeyMessage(error));
        } finally {
            setLoadingPasskey(false);
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
            loadingPasskey={loadingPasskey}
            handleDeleteAccount={handleDeleteAccount}
            handleChangePassword={handleChangePassword}
            handleEnrollPasskey={handleEnrollPasskey}
            hasPasswordProvider={userHasPasswordProvider()}
        />
    );
};

export default SecurityTab;
