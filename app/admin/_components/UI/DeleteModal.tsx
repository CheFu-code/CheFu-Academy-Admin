import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { Loader2 } from 'lucide-react';
import React from 'react';

const DeleteModal = ({
    confirmOpen,
    setConfirmOpen,
    selectedUser,
    closeDeleteModal,
    confirmDelete,
    deletingId,
    isDeletingSelected,
}: {
    confirmOpen: boolean;
    setConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedUser: User | null;
    closeDeleteModal: () => void;
    confirmDelete: () => void;
    deletingId: string | null;
    isDeletingSelected: boolean;
}) => {
    return (
        <AlertDialog
            open={confirmOpen}
            onOpenChange={(open) => !deletingId && setConfirmOpen(open)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete user?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to permanently delete{' '}
                        <span className="font-semibold text-foreground">
                            {selectedUser?.fullname ?? 'this user'}
                        </span>
                        . This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={closeDeleteModal}
                        disabled={!!deletingId}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={!!deletingId}
                            className="cursor-pointer"
                            size={'sm'}
                        >
                            {isDeletingSelected ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting…
                                </>
                            ) : (
                                <>Delete</>
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteModal;
