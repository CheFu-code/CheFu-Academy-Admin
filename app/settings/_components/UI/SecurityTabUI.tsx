import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { ClipboardCheck, KeyRound, ShieldCheck } from 'lucide-react';

const SecurityTabUI = ({
    openDelete,
    setOpenDelete,
    openChange,
    setOpenChange,
    openPasskeyDialog,
    setOpenPasskeyDialog,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    deletePassword,
    setDeletePassword,
    passkeyPassword,
    setPasskeyPassword,
    loadingDelete,
    loadingChange,
    loadingPasskey,
    handleDeleteAccount,
    handleChangePassword,
    handleEnrollPasskey,
    handleConfirmEnrollPasskey,
    hasPasswordProvider,
    passkeySupport,
    generatedPassword,
    handleGenerateStrongPassword,
    handleCopyGeneratedPassword,
    handleUseGeneratedPassword,
    handleCopySecuritySnapshot,
}: {
    openDelete: boolean;
    setOpenDelete: (value: boolean) => void;
    openChange: boolean;
    setOpenChange: (value: boolean) => void;
    openPasskeyDialog: boolean;
    setOpenPasskeyDialog: (value: boolean) => void;
    currentPassword: string;
    setCurrentPassword: (value: string) => void;
    newPassword: string;
    setNewPassword: (value: string) => void;
    deletePassword: string;
    setDeletePassword: (value: string) => void;
    passkeyPassword: string;
    setPasskeyPassword: (value: string) => void;
    loadingDelete: boolean;
    loadingChange: boolean;
    loadingPasskey: boolean;
    handleDeleteAccount: () => void;
    handleChangePassword: () => void;
    handleEnrollPasskey: () => void;
    handleConfirmEnrollPasskey: () => void;
    hasPasswordProvider: boolean;
    passkeySupport: 'checking' | 'supported' | 'unsupported';
    generatedPassword: string;
    handleGenerateStrongPassword: () => void;
    handleCopyGeneratedPassword: () => void;
    handleUseGeneratedPassword: () => void;
    handleCopySecuritySnapshot: () => void;
}) => {

    return (
        <TabsContent value="security" className="mt-4 space-y-4 px-2 sm:mt-6 sm:px-4">
            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Security Settings</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Protect your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            if (hasPasswordProvider) {
                                setOpenPasskeyDialog(true);
                                return;
                            }
                            handleEnrollPasskey();
                        }}
                        disabled={loadingPasskey}
                    >
                        <KeyRound className="mr-2 h-4 w-4" />
                        {loadingPasskey
                            ? 'Enrolling...'
                            : 'Enroll Passkey'}
                    </Button>

                    <Dialog
                        open={openPasskeyDialog}
                        onOpenChange={(open) => {
                            setOpenPasskeyDialog(open);
                            if (!open) setPasskeyPassword('');
                        }}
                    >
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Confirm to Enroll Passkey</DialogTitle>
                                <DialogDescription>
                                    Enter your current password to securely continue passkey enrollment.
                                </DialogDescription>
                            </DialogHeader>

                            <Input
                                type="password"
                                autoComplete="current-password"
                                placeholder="Current password"
                                value={passkeyPassword}
                                onChange={(e) => setPasskeyPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleConfirmEnrollPasskey();
                                    }
                                }}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setOpenPasskeyDialog(false);
                                        setPasskeyPassword('');
                                    }}
                                    disabled={loadingPasskey}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmEnrollPasskey}
                                    disabled={loadingPasskey || !passkeyPassword.trim()}
                                >
                                    {loadingPasskey ? 'Enrolling...' : 'Continue'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Change Password Modal */}
                    <Dialog open={openChange} onOpenChange={setOpenChange}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Change Password</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription>
                                    <span className="text-red-500 font-medium text-xs">
                                        Note: Changing your password will log out all other devices currently
                                        signed in with this account. This helps you keep your account secure.
                                    </span>
                                </DialogDescription>
                            </DialogHeader>

                            {hasPasswordProvider ? (
                                <>
                                    <Input
                                        type="password"
                                        placeholder="Current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <DialogFooter>
                                        <Button
                                            onClick={handleChangePassword}
                                            disabled={loadingChange || !currentPassword || !newPassword}
                                        >
                                            {loadingChange ? 'Updating...' : 'Update'}
                                        </Button>
                                    </DialogFooter>
                                </>
                            ) : (
                                <>
                                    <div className="text-sm text-muted-foreground">
                                        Your account is currently signed in with Google. To change your
                                        password, first add a password to your account (link the Email/Password
                                        provider). Once added, you can come back here to update it.
                                    </div>
                                    <DialogFooter>
                                        <Button disabled variant="secondary" title="Add a password first">
                                            Update (requires password provider)
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Delete Account Modal */}
                    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                        <DialogTrigger asChild>
                            <Button disabled={loadingDelete} variant="destructive">
                                Delete Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Account</DialogTitle>
                                <DialogDescription className="whitespace-pre-line">
                                    {hasPasswordProvider
                                        ? 'Enter your password to confirm deletion.'
                                        : `You will be asked to confirm your identity with Google before we can delete your account.`}
                                </DialogDescription>
                            </DialogHeader>

                            {hasPasswordProvider ? (
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                />
                            ) : null}

                            <DialogFooter>
                                <Button
                                    onClick={handleDeleteAccount}
                                    disabled={loadingDelete || (hasPasswordProvider && !deletePassword)}
                                    variant="destructive"
                                >
                                    {loadingDelete
                                        ? 'Deleting...'
                                        : hasPasswordProvider
                                            ? 'Confirm'
                                            : 'Continue with Google'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Security Tools</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Extra tools to harden and audit your account access.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-sm font-medium">Passkey compatibility</span>
                        </div>
                        <Badge
                            variant={
                                passkeySupport === 'supported'
                                    ? 'default'
                                    : passkeySupport === 'unsupported'
                                        ? 'destructive'
                                        : 'secondary'
                            }
                        >
                            {passkeySupport === 'checking'
                                ? 'Checking...'
                                : passkeySupport === 'supported'
                                    ? 'Supported'
                                    : 'Not supported'}
                        </Badge>
                    </div>

                    <div className="space-y-2 rounded-lg border p-3">
                        <p className="text-sm font-medium">Strong password generator</p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Input
                                readOnly
                                value={generatedPassword}
                                placeholder="Generate a strong password"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGenerateStrongPassword}
                            >
                                Generate
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCopyGeneratedPassword}
                            >
                                Copy Password
                            </Button>
                            <Button
                                type="button"
                                onClick={handleUseGeneratedPassword}
                            >
                                Use in Change Password
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg border p-3">
                        <p className="mb-2 text-sm font-medium">Security snapshot</p>
                        <p className="mb-3 text-xs text-muted-foreground">
                            Copy account security metadata for support or personal audit.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCopySecuritySnapshot}
                        >
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            Copy Security Snapshot
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default SecurityTabUI;
