'use client';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { db } from '@/lib/firebase';
import { User } from '@/types/user';
import { userMatches } from '@/utils/userSearch';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
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

    const handleDelete = async (user: User) => {
        // 1) Delete Firestore doc
        try {
            setDeleting(true);
            await deleteDoc(doc(db, 'users', user.id));
            toast.success('User deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user. Please try again.');
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
