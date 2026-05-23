'use client';

import SetupModal from '@/app/admin/_components/UI/Settings/SetupModal';
import {
    generateMfaBackupCodes,
    hashMfaBackupCodes,
} from '@/helpers/mfaBackupCodes';
import { auth, db } from '@/lib/firebase';
import { sendPasswordChangedAlert } from '@/lib/passwordChangedEmail';
import {
    isPasskeyReady,
    registerPasskey,
    toPasskeyMessage
} from '@/lib/passkeys';
import { FirebaseError } from 'firebase/app';
import {
    EmailAuthProvider,
    GoogleAuthProvider,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    multiFactor,
    TotpMultiFactorGenerator,
    TotpSecret,
    updatePassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SecurityTabUI from './UI/SecurityTabUI';

const SecurityTab = () => {
    const [openDelete, setOpenDelete] = useState(false);
    const [openChange, setOpenChange] = useState(false);
    const [openPasskeyDialog, setOpenPasskeyDialog] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [passkeyPassword, setPasskeyPassword] = useState('');
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingChange, setLoadingChange] = useState(false);
    const [loadingPasskey, setLoadingPasskey] = useState(false);
    const [loadingMfa, setLoadingMfa] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [securityInfoVersion, setSecurityInfoVersion] = useState(0);
    const [totpEnabled, setTotpEnabled] = useState(false);
    const [mfaKnown, setMfaKnown] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [twoFACode, setTwoFACode] = useState('');
    const [totpSecret, setTotpSecret] = useState<TotpSecret | null>(null);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [secretText, setSecretText] = useState<string | null>(null);
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [passkeySupport, setPasskeySupport] = useState<
        'checking' | 'supported' | 'unsupported'
    >('checking');

    useEffect(() => {
        let mounted = true;
        const checkSupport = async () => {
            try {
                const ready = await isPasskeyReady();
                if (!mounted) return;
                setPasskeySupport(ready ? 'supported' : 'unsupported');
            } catch {
                if (!mounted) return;
                setPasskeySupport('unsupported');
            }
        };
        void checkSupport();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setMfaKnown(true);
            setTotpEnabled(false);
            return;
        }

        const enrolled = multiFactor(user).enrolledFactors.some(
            factor => factor.factorId === TotpMultiFactorGenerator.FACTOR_ID,
        );
        setTotpEnabled(enrolled);
        setMfaKnown(true);
    }, [securityInfoVersion]);

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

            try {
                await sendPasswordChangedAlert();
                toast.success('Your password has been updated.');
                setOpenChange(false);
                setCurrentPassword('');
                setNewPassword('');
            } catch (emailError: unknown) {
                console.error('Password-changed alert email failed:', emailError);
                toast.error('Password updated, but alert email could not be sent.');
            }
        } catch (error: unknown) {
            console.error('Error changing password:', error);
            toast.error('Failed to change password.');
        } finally {
            setLoadingChange(false);
        }
    };

    const handleEnrollPasskey = async (reauthPassword?: string) => {
        const user = auth.currentUser;
        if (!user) {
            toast.error('No user is logged in.');
            return false;
        }

        setLoadingPasskey(true);
        try {
            if (userHasPasswordProvider() && !reauthPassword) {
                toast.error('Enter your current password to enroll a passkey.');
                return false;
            }

            await reauthenticateSensitiveAction(user, reauthPassword);

            const ready = await isPasskeyReady();
            if (!ready) {
                toast.error('Passkeys are not supported on this device/browser.');
                return false;
            }

            const ok = await registerPasskey(user.uid, user.email || user.uid);
            if (!ok) {
                toast.error('Passkey enrollment failed.');
                return false;
            }

            toast.success('Passkey enrolled successfully.');
            return true;
        } catch (error: unknown) {
            console.error('Error enrolling passkey:', error);
            toast.error(toPasskeyMessage(error));
            return false;
        } finally {
            setLoadingPasskey(false);
        }
    };

    const handleConfirmEnrollPasskey = async () => {
        const password = passkeyPassword.trim();
        if (!password) {
            toast.error('Enter your current password to continue.');
            return;
        }

        const ok = await handleEnrollPasskey(password);
        if (ok) {
            setOpenPasskeyDialog(false);
            setPasskeyPassword('');
        }
    };

    const handleGenerateStrongPassword = () => {
        const charset =
            'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+';
        const bytes = new Uint32Array(20);
        crypto.getRandomValues(bytes);
        const next = Array.from(bytes, b => charset[b % charset.length]).join(
            '',
        );
        setGeneratedPassword(next);
        toast.success('Strong password generated.');
    };

    const handleCopyGeneratedPassword = async () => {
        if (!generatedPassword) {
            toast.error('Generate a password first.');
            return;
        }
        try {
            await navigator.clipboard.writeText(generatedPassword);
            toast.success('Password copied to clipboard.');
        } catch {
            toast.error('Could not copy password.');
        }
    };

    const handleUseGeneratedPassword = () => {
        if (!generatedPassword) {
            toast.error('Generate a password first.');
            return;
        }
        setNewPassword(generatedPassword);
        setOpenChange(true);
        toast.success('Password inserted into Change Password form.');
    };

    const handleCopySecuritySnapshot = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast.error('No user is logged in.');
            return;
        }

        const providerIds =
            user.providerData.map(provider => provider.providerId).join(', ') ||
            'none';

        const snapshot = [
            `Email: ${user.email || 'N/A'}`,
            `UID: ${user.uid}`,
            `Providers: ${providerIds}`,
            `Created: ${user.metadata.creationTime || 'N/A'}`,
            `Last Sign In: ${user.metadata.lastSignInTime || 'N/A'}`,
            `Passkey Support: ${passkeySupport}`,
        ].join('\n');

        try {
            await navigator.clipboard.writeText(snapshot);
            toast.success('Security snapshot copied.');
        } catch {
            toast.error('Could not copy security snapshot.');
        }
    };

    const refreshSecurityInfo = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast.error('No user is logged in.');
            return;
        }

        try {
            await user.reload();
            await user.getIdToken(true);
            setSecurityInfoVersion(version => version + 1);
            toast.success('Security session refreshed.');
        } catch (error) {
            console.error('Failed to refresh security session:', error);
            toast.error('Failed to refresh security session.');
        }
    };

    const startTotpSetup = async () => {
        const user = auth.currentUser;
        if (!user?.email) {
            toast.error('No user is logged in.');
            return;
        }

        setLoadingMfa(true);
        try {
            const session = await multiFactor(user).getSession();
            const secret = await TotpMultiFactorGenerator.generateSecret(session);
            const uri = secret.generateQrCodeUrl(user.email, 'CheFu Academy');
            const qr = await QRCode.toDataURL(uri);

            setTotpSecret(secret);
            setQrDataUrl(qr);
            setSecretText(secret.secretKey);
            setTwoFACode('');
            setBackupCodes([]);
            setShow2FAModal(true);
        } catch (error) {
            console.error('Failed to start 2FA setup:', error);
            toast.error('Could not start 2FA setup. Please sign in again.');
        } finally {
            setLoadingMfa(false);
        }
    };

    const handleVerify2FA = async () => {
        const user = auth.currentUser;
        if (!user?.email || !totpSecret) {
            toast.error('2FA setup is not ready.');
            return;
        }

        setLoadingMfa(true);
        try {
            const assertion = TotpMultiFactorGenerator.assertionForEnrollment(
                totpSecret,
                twoFACode,
            );
            await multiFactor(user).enroll(assertion, 'CheFu TOTP');

            const codes = generateMfaBackupCodes();
            const hashedCodes = await hashMfaBackupCodes(codes, user.uid);

            await setDoc(
                doc(db, 'users', user.email),
                {
                    mfaBackupCodes: {
                        generatedAt: new Date(),
                        remaining: codes.length,
                        codes: hashedCodes,
                    },
                },
                { merge: true },
            );

            await user.reload();
            setTotpEnabled(true);
            setBackupCodes(codes);
            setTwoFACode('');
            setTotpSecret(null);
            setQrDataUrl(null);
            setSecretText(null);
            toast.success('2FA enabled. Save your backup codes now.');
        } catch (error) {
            console.error('Failed to enable 2FA:', error);
            toast.error('Could not enable 2FA. Check the code and try again.');
        } finally {
            setLoadingMfa(false);
        }
    };

    const disableTotp = async () => {
        const user = auth.currentUser;
        if (!user?.email) {
            toast.error('No user is logged in.');
            return;
        }

        setLoadingMfa(true);
        try {
            const mfaUser = multiFactor(user);
            const factor = mfaUser.enrolledFactors.find(
                item => item.factorId === TotpMultiFactorGenerator.FACTOR_ID,
            );

            if (factor) {
                await mfaUser.unenroll(factor.uid);
            }

            await setDoc(
                doc(db, 'users', user.email),
                {
                    mfaBackupCodes: {
                        disabledAt: new Date(),
                        remaining: 0,
                        codes: [],
                    },
                },
                { merge: true },
            );

            await user.reload();
            setBackupCodes([]);
            setTotpEnabled(false);
            toast.success('2FA disabled.');
        } catch (error) {
            console.error('Failed to disable 2FA:', error);
            toast.error('Could not disable 2FA. Please sign in again.');
        } finally {
            setLoadingMfa(false);
        }
    };

    const handleToggleTotp = async () => {
        if (totpEnabled) {
            await disableTotp();
            return;
        }

        await startTotpSetup();
    };

    const currentUser = auth.currentUser;

    return (
        <>
            <SecurityTabUI
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            openChange={openChange}
            setOpenChange={setOpenChange}
            openPasskeyDialog={openPasskeyDialog}
            setOpenPasskeyDialog={setOpenPasskeyDialog}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            deletePassword={deletePassword}
            setDeletePassword={setDeletePassword}
            passkeyPassword={passkeyPassword}
            setPasskeyPassword={setPasskeyPassword}
            loadingDelete={loadingDelete}
            loadingChange={loadingChange}
            loadingPasskey={loadingPasskey}
            handleDeleteAccount={handleDeleteAccount}
            handleChangePassword={handleChangePassword}
            handleEnrollPasskey={() => void handleEnrollPasskey()}
            handleConfirmEnrollPasskey={handleConfirmEnrollPasskey}
            hasPasswordProvider={userHasPasswordProvider()}
            passkeySupport={passkeySupport}
            generatedPassword={generatedPassword}
            handleGenerateStrongPassword={handleGenerateStrongPassword}
            handleCopyGeneratedPassword={handleCopyGeneratedPassword}
            handleUseGeneratedPassword={handleUseGeneratedPassword}
            handleCopySecuritySnapshot={handleCopySecuritySnapshot}
            handleRefreshSecurityInfo={refreshSecurityInfo}
            securityInfoVersion={securityInfoVersion}
            connectedProviders={
                currentUser?.providerData.map(provider => provider.providerId) || []
            }
            createdAt={currentUser?.metadata.creationTime || 'N/A'}
            lastSignInAt={currentUser?.metadata.lastSignInTime || 'N/A'}
            totpEnabled={totpEnabled}
            mfaKnown={mfaKnown}
            loadingMfa={loadingMfa}
            handleToggleTotp={() => void handleToggleTotp()}
            />
            <SetupModal
                show2FAModal={show2FAModal}
                setShow2FAModal={setShow2FAModal}
                twoFACode={twoFACode}
                setTwoFACode={setTwoFACode}
                handleVerify2FA={handleVerify2FA}
                qrDataUrl={qrDataUrl}
                secretText={secretText}
                loading={loadingMfa}
                backupCodes={backupCodes}
                onBackupCodesSaved={() => {
                    setBackupCodes([]);
                    setShow2FAModal(false);
                }}
                title="Enable Two-Factor Authentication"
                description="Scan this QR in Google Authenticator, 1Password, or Authy, then enter the current 6-digit code."
            />
        </>
    );
};

export default SecurityTab;
