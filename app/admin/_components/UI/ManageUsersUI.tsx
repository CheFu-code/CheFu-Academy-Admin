import { Button } from '@/components/ui/button';
import { Loader2, Search, Trash2, Users, X } from 'lucide-react';
import * as React from 'react';

import Header from '@/components/Shared/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { roleToBadgeVariant } from '@/helpers/highlightAdmin';
import { ManageUsersProps } from '@/types';
import DeleteModal from './DeleteModal';

const ManageUsersUI: React.FC<ManageUsersProps> = ({
    loading,
    search,
    setSearch,
    filteredUsers,
    onDelete,
    total,
    confirmOpen,
    setConfirmOpen,
    selectedUser,
    setSelectedUser,
    deletingId,
    setDeletingId,
    isDeletingSelected,
    deleting,
    openDeleteModal,
    closeDeleteModal,
}) => {
    const confirmDelete = async () => {
        if (!selectedUser || !onDelete) return;

        const id = selectedUser.uid ?? selectedUser.id;

        try {
            setDeletingId(id);
            onDelete(selectedUser); // ✅ actual delete happens here
            setConfirmOpen(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Failed to delete user:', err);
            // Optional: show toast here
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-2 sm:p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <Header
                    header=" Manage Users"
                    description="Search, view, and manage user access across your
                        platform."
                />

                {/* Search */}
                <div className="w-full sm:w-90">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, or role..."
                            className="pl-9"
                            aria-label="Search users"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4 cursor-pointer" />
                            </button>
                        )}
                    </div>

                    {search && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            Showing results for{' '}
                            <span className="font-medium text-foreground">
                                “{search}”
                            </span>
                        </p>
                    )}
                </div>
            </div>

            {/* Content Card */}
            <Card className="border-muted/60 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <CardTitle className="flex items-center">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                            <Users className="h-5 w-5" />
                        </span>
                        Users
                        <Badge variant="secondary" className="ml-2">
                            {loading ? (
                                '…'
                            ) : (
                                <span className="font-bold">{total}</span>
                            )}
                        </Badge>
                    </CardTitle>

                    <Button size={'sm'} className="inline-flex cursor-pointer">
                        Export
                    </Button>
                </CardHeader>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center gap-2 py-14 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm">Loading users…</span>
                        </div>
                    ) : total === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                            <div className="rounded-full bg-muted p-3">
                                <Users className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium">No users found</p>

                                <p className="text-sm text-muted-foreground">
                                    Try a different keyword or use filters like{' '}
                                    <span className="font-mono">
                                        role:admin
                                    </span>
                                    .
                                </p>
                            </div>
                            <div className="mt-2 flex gap-2">
                                <Button
                                    onClick={() => setSearch('')}
                                    variant="outline"
                                >
                                    Clear search
                                </Button>
                                <Button>Add User</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                                        <TableHead className="w-65 font-semibold">
                                            Name
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Email
                                        </TableHead>
                                        <TableHead className="w-35 font-semibold">
                                            Role
                                        </TableHead>
                                        <TableHead className="w-35 font-semibold">
                                            Joined
                                        </TableHead>
                                        <TableHead className="w-40 text-right font-semibold">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredUsers.map((user) => {
                                        const roleText = Array.isArray(
                                            user.roles,
                                        )
                                            ? user.roles.join(', ')
                                            : String(user.roles ?? '-');

                                        return (
                                            <TableRow
                                                key={user.id}
                                                className="hover:bg-muted/30 transition-colors"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-linear-to-br from-muted to-muted/40 flex items-center justify-center border">
                                                            <Avatar>
                                                                <AvatarImage
                                                                    src={
                                                                        user?.profilePicture
                                                                    }
                                                                    alt="User"
                                                                />
                                                                <AvatarFallback>
                                                                    {user
                                                                        ?.fullname?.[0] ||
                                                                        'CA'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate">
                                                                {user.fullname}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                ID: {user.uid}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-muted-foreground">
                                                    <span className="truncate block max-w-105">
                                                        {user.email}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant={roleToBadgeVariant(
                                                            roleText,
                                                        )}
                                                    >
                                                        {roleText}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-muted-foreground">
                                                    {user.createdAt?.toDate
                                                        ? user.createdAt
                                                              .toDate()
                                                              .toLocaleDateString()
                                                        : '-'}
                                                </TableCell>

                                                {!user.roles.includes(
                                                    'admin',
                                                ) && (
                                                    <TableCell className="text-right">
                                                        <div className="inline-flex items-center gap-2">
                                                            <Button
                                                                disabled={
                                                                    deleting
                                                                }
                                                                variant="destructive"
                                                                size="sm"
                                                                className="gap-2 cursor-pointer"
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                {deleting ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                        Deleting…
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Trash2 className="h-4 w-4" />
                                                                        Delete
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            {/* Footer / hint row */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3 border-t bg-background">
                                <p className="text-xs text-muted-foreground">
                                    Showing{' '}
                                    <span className="font-medium text-foreground">
                                        {total}
                                    </span>{' '}
                                    result{total === 1 ? '' : 's'}.
                                </p>

                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        Previous
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <DeleteModal
                confirmOpen={confirmOpen}
                setConfirmOpen={setConfirmOpen}
                selectedUser={selectedUser}
                closeDeleteModal={closeDeleteModal}
                confirmDelete={confirmDelete}
                deletingId={deletingId}
                isDeletingSelected={isDeletingSelected}
            />
        </div>
    );
};

export default ManageUsersUI;
