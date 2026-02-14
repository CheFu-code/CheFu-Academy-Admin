import React from 'react';
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
    handleDeleteAccount,
    handleChangePassword,
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
    handleDeleteAccount: () => void;
    handleChangePassword: () => void;
}) => {
    return (
        <TabsContent value="security" className="mt-4 sm:mt-6 px-2 sm:px-4">
            <Card>
                <CardHeader className="px-3 sm:px-4 py-3">
                    <CardTitle className="text-base sm:text-lg">
                        Security Settings
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Protect your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col sm:flex-row gap-2 sm:gap-4 px-3 sm:px-4 pb-3">
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
                                        Note: Changing your password will log
                                        out all other devices currently signed
                                        in with this account. This helps you
                                        keep your account secure.
                                    </span>
                                </DialogDescription>
                            </DialogHeader>
                            <Input
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
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
                                    disabled={
                                        loadingChange ||
                                        !currentPassword ||
                                        !newPassword
                                    }
                                >
                                    {loadingChange ? 'Updating...' : 'Update'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Account Modal */}
                    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                        <DialogTrigger asChild>
                            <Button
                                disabled={loadingDelete}
                                variant="destructive"
                            >
                                Delete Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Account</DialogTitle>
                                <DialogDescription>
                                    Enter your password to confirm deletion.
                                </DialogDescription>
                            </DialogHeader>
                            <Input
                                type="password"
                                placeholder="Password"
                                value={deletePassword}
                                onChange={(e) =>
                                    setDeletePassword(e.target.value)
                                }
                            />
                            <DialogFooter>
                                <Button
                                    onClick={handleDeleteAccount}
                                    disabled={loadingDelete || !deletePassword}
                                    variant="destructive"
                                >
                                    {loadingDelete ? 'Deleting...' : 'Confirm'}
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
