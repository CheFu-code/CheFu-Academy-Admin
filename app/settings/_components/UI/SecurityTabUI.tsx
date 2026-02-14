import { Button } from '@/components/ui/button';
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
import { KeyRound } from 'lucide-react';

const SecurityTabUI = ({
    openDelete,
    setOpenDelete,
    openChange,
    setOpenChange,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    deletePassword,
    setDeletePassword,
    loadingDelete,
    loadingChange,
    loadingPasskey,
    handleDeleteAccount,
    handleChangePassword,
    handleEnrollPasskey,
    hasPasswordProvider,
    passkeyEnrolled,
}: {
    openDelete: boolean;
    setOpenDelete: (value: boolean) => void;
    openChange: boolean;
    setOpenChange: (value: boolean) => void;
    currentPassword: string;
    setCurrentPassword: (value: string) => void;
    newPassword: string;
    setNewPassword: (value: string) => void;
    deletePassword: string;
    setDeletePassword: (value: string) => void;
    loadingDelete: boolean;
    loadingChange: boolean;
    loadingPasskey: boolean;
    handleDeleteAccount: () => void;
    handleChangePassword: () => void;
    handleEnrollPasskey: () => void;
    hasPasswordProvider: boolean;
    passkeyEnrolled: boolean | null;
}) => {

    return (
        <TabsContent value="security" className="mt-4 sm:mt-6 px-2 sm:px-4">
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
                        onClick={handleEnrollPasskey}
                        disabled={loadingPasskey || passkeyEnrolled === true}
                    >
                        <KeyRound className="mr-2 h-4 w-4" />
                        {loadingPasskey
                            ? 'Enrolling...'
                            : passkeyEnrolled === true
                                ? 'Already enrolled'
                                : 'Enroll Passkey'}
                    </Button>

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
        </TabsContent>
    );
};

export default SecurityTabUI;
