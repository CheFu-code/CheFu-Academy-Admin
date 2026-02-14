import { Ticket } from './supportTicket';
export interface DashboardUIProps {
    totalUsers: number | null;
    monthlyUsers: number | null;
    loading: boolean;
    totalCourses: number | null;
    monthlyCourses: number | null;
    totalVideos: number | null;
    monthlyVideos: number | null;
    totalAPIKeys: number | null;
    monthlyAPIKeys: number | null;
    recentTickets?: Ticket[];
    openTickets?: number | null;
    pendingTickets?: number | null;
    resolvedTickets?: number | null;
    overdueTickets?: number | null;
    unreadTickets?: number | null;
}

export type ManageUsersProps = {
    filteredUsers: User[];
    loading: boolean;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
    total: number;
    confirmOpen: boolean;
    setConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedUser: User | null;
    setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
    deletingId: string | null;
    setDeletingId: React.Dispatch<React.SetStateAction<string | null>>;
    isDeletingSelected: boolean;
    deleting: boolean;
    openDeleteModal: (user: User) => void;
    closeDeleteModal: () => void;
    confirmDelete: () => Promise<void>;
};

// Firestore device as you described
export type FirestoreTrustedDevice = {
    brand?: string;
    deviceType?: number; // 0=desktop, 1=phone, 2=tablet, etc. (your enum)
    modelName?: string;
    osName?: string;
    osVersion?: string;

    // Optional/enhancements if you later add them:
    ip?: string;
    location?: string;
    lastActive?: string; // ISO string
    current?: boolean; // mark current device
    deviceId?: string; // recommended unique id if you move to subcollection or sessions
};
