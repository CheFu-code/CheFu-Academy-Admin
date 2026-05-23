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
import {
    AlertTriangle,
    CheckCircle2,
    ClipboardCheck,
    Fingerprint,
    KeyRound,
    LockKeyhole,
    ShieldCheck,
} from 'lucide-react';

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
    handleRefreshSecurityInfo,
    securityInfoVersion,
    connectedProviders,
    createdAt,
    lastSignInAt,
    totpEnabled,
    mfaKnown,
    loadingMfa,
    handleToggleTotp,
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
    handleRefreshSecurityInfo: () => void;
    securityInfoVersion: number;
    connectedProviders: string[];
    createdAt: string;
    lastSignInAt: string;
    totpEnabled: boolean;
    mfaKnown: boolean;
    loadingMfa: boolean;
    handleToggleTotp: () => void;
}) => {
    const passwordStrength = [
        newPassword.length >= 12,
        /[A-Z]/.test(newPassword),
        /[a-z]/.test(newPassword),
        /\d/.test(newPassword),
        /[^A-Za-z0-9]/.test(newPassword),
    ].filter(Boolean).length;

    return (
        <TabsContent value="security" className="mt-4 space-y-4 px-2 sm:mt-6 sm:px-4">
            <div className="grid gap-3 md:grid-cols-3">
                <Card className="border-border/60 bg-muted/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <LockKeyhole className="h-4 w-4 text-cyan-500" />
                            Sign-in method
                        </div>
                        <Badge className="mt-3" variant={hasPasswordProvider ? 'default' : 'secondary'}>
                            {hasPasswordProvider ? 'Password enabled' : 'Google sign-in'}
                        </Badge>
                    </CardContent>
                </Card>
                <Card className="border-border/60 bg-muted/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Fingerprint className="h-4 w-4 text-cyan-500" />
                            Passkeys
                        </div>
                        <Badge
                            className="mt-3"
                            variant={
                                passkeySupport === 'supported'
                                    ? 'default'
                                    : passkeySupport === 'unsupported'
                                        ? 'destructive'
                                        : 'secondary'
                            }
                        >
                            {passkeySupport === 'checking'
                                ? 'Checking'
                                : passkeySupport === 'supported'
                                    ? 'Ready'
                                    : 'Unavailable'}
                        </Badge>
                    </CardContent>
                </Card>
                <Card className="border-border/60 bg-muted/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <ShieldCheck className="h-4 w-4 text-cyan-500" />
                            Sensitive actions
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Re-authentication required.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Security Settings</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Manage sign-in options and sensitive account actions.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-3 md:grid-cols-3">
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
                        disabled={loadingPasskey || passkeySupport === 'unsupported'}
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
                            <Button variant="outline">
                                <LockKeyhole className="mr-2 h-4 w-4" />
                                Change Password
                            </Button>
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
                                    {newPassword && (
                                        <div className="space-y-2">
                                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full bg-cyan-500 transition-all"
                                                    style={{
                                                        width: `${(passwordStrength / 5) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Password strength: {passwordStrength}/5
                                            </p>
                                        </div>
                                    )}
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
                                <AlertTriangle className="mr-2 h-4 w-4" />
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
                    <CardTitle className="text-base sm:text-lg">
                        Connected Sign-in & Activity
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Review providers and recent Firebase authentication metadata.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border bg-muted/20 p-3">
                            <p className="text-sm font-medium">Connected providers</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {connectedProviders.length ? (
                                    connectedProviders.map(provider => (
                                        <Badge key={provider} variant="secondary">
                                            {provider}
                                        </Badge>
                                    ))
                                ) : (
                                    <Badge variant="secondary">No providers found</Badge>
                                )}
                            </div>
                        </div>
                        <div className="rounded-lg border bg-muted/20 p-3">
                            <p className="text-sm font-medium">Recent security activity</p>
                            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                <p>Created: {createdAt}</p>
                                <p>Last sign-in: {lastSignInAt}</p>
                                <p>Session refreshes: {securityInfoVersion}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleRefreshSecurityInfo}
                        >
                            Refresh Session Info
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenChange(true)}
                        >
                            Log Out Other Devices via Password Change
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                        Two-Factor Authentication
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Protect your account with an authenticator app and one-time recovery codes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <Badge variant={totpEnabled ? 'default' : 'secondary'}>
                            {!mfaKnown
                                ? 'Checking'
                                : totpEnabled
                                    ? 'Enabled'
                                    : 'Not enabled'}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                            {totpEnabled
                                ? 'You will need your authenticator app or a saved backup code when signing in.'
                                : 'Enable 2FA to receive recovery backup codes for this account.'}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant={totpEnabled ? 'destructive' : 'default'}
                        onClick={handleToggleTotp}
                        disabled={loadingMfa || !mfaKnown}
                    >
                        {loadingMfa
                            ? 'Working...'
                            : totpEnabled
                                ? 'Disable 2FA'
                                : 'Enable 2FA'}
                    </Button>
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
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/20 p-3">
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

                    <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                        <p className="text-sm font-medium">Strong password generator</p>
                        <p className="text-xs text-muted-foreground">
                            Generate a local password suggestion. It is not saved until you use it.
                        </p>
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

                    <div className="rounded-lg border bg-muted/20 p-3">
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

                    <div className="flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                        <p className="text-muted-foreground">
                            Password changes, passkey enrollment, and account deletion all require a fresh identity check.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default SecurityTabUI;
