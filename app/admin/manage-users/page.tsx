'use client';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { db } from '@/lib/firebase';
import { User } from '@/types/user';
import { userMatches } from '@/utils/userSearch';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useState } from 'react';
import { toast } from 'sonner';
import ManageUsersUI from '../_components/UI/ManageUsersUI';

const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);
    const [deleting, setDeleting] = React.useState(false);

    const debouncedSearch = useDebouncedValue(search, 250);
    const deferredSearch = React.useDeferredValue(debouncedSearch);

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snap) => {
            const data = snap.docs.map(
                (d) => ({ id: d.id, ...d.data() }) as User,
            );
            setUsers(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (user: {
        uid: string;
        email: string;
        id: string;
    }) => {
        try {
            setDeleting(true);

            // 1️⃣ Call your Next.js API route
            const res = await fetch('/api/admin/delete-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email, // ensure this matches your Firestore doc ID
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete user');
            }

            toast.success('User deleted successfully.');
        } catch (error: unknown) {
            console.error('Error deleting user:', error);
            let message = 'Failed to delete user. Please try again.';
            if (error instanceof Error) {
                message = error.message;
            }
            toast.error(message);
        } finally {
            setDeleting(false);
        }
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setConfirmOpen(true);
    };

    const closeDeleteModal = () => {
        if (deletingId) return; // prevent closing while deleting
        setConfirmOpen(false);
        setSelectedUser(null);
    };

    const isDeletingSelected =
        deletingId != null &&
        (selectedUser?.uid ?? selectedUser?.id) === deletingId;

    const filteredUsers = React.useMemo(() => {
        if (!deferredSearch) return users;
        return users.filter((u) => userMatches(u, deferredSearch));
    }, [users, deferredSearch]);
    const total = filteredUsers.length;

    return (
        <ManageUsersUI
            filteredUsers={filteredUsers}
            loading={loading}
            search={search}
            setSearch={setSearch}
            total={total}
            onDelete={handleDelete}
            confirmOpen={confirmOpen}
            setConfirmOpen={setConfirmOpen}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            deletingId={deletingId}
            setDeletingId={setDeletingId}
            isDeletingSelected={isDeletingSelected}
            deleting={deleting}
            openDeleteModal={openDeleteModal}
            closeDeleteModal={closeDeleteModal}
        />
    );
};

export default ManageUsers;
