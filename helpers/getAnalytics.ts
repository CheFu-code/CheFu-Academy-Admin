import { db } from "@/lib/firebase";
import { collection, getCountFromServer, query, where } from "firebase/firestore";

// Total users in Firestore (fallback if GA4 fails)
export const getTotalUsers = async () => {
    const usersRef = collection(db, "users");
    const snapshot = await getCountFromServer(usersRef);
    return snapshot.data().count;
};

export const getMonthlyUsers = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("createdAt", ">=", startOfMonth));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

// Total courses
export const getTotalCourses = async () => {
    const coursesRef = collection(db, "course");
    const snapshot = await getCountFromServer(coursesRef);
    return snapshot.data().count;
};

export const getMonthlyCourses = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const coursesRef = collection(db, "course");
    const q = query(coursesRef, where("createdOn", ">=", startOfMonth));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const getTotalVideos = async () => {
    const coursesRef = collection(db, "videos");
    const snapshot = await getCountFromServer(coursesRef);
    return snapshot.data().count;
};

export const getMonthlyVideos = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const coursesRef = collection(db, "videos");
    const q = query(coursesRef, where("uploadedAt", ">=", startOfMonth));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const getTotalAPIKeys = async () => {
    const apiKeysRef = collection(db, "api_keys");
    const snapshot = await getCountFromServer(apiKeysRef);
    return snapshot.data().count;
};

export const getMonthlyAPIKeys = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const apiKeysRef = collection(db, "api_keys");
    const q = query(apiKeysRef, where("createdAt", ">=", startOfMonth));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
};

export const getOpenTickets = async () => {
    const ticketRef = collection(db, 'support-tickets')
    const q = query(ticketRef, where('status', '==', 'open'))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
}
export const getPendingTickets = async () => {
    const ticketRef = collection(db, 'support-tickets')
    const q = query(ticketRef, where('status', '==', 'pending'))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
}
export const getResolvedTickets = async () => {
    const ticketRef = collection(db, 'support-tickets')
    const q = query(ticketRef, where('status', '==', 'resolved'))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
}
export const getOverdueTickets = async () => {
    const ticketRef = collection(db, 'support-tickets')
    const q = query(ticketRef, where('overdue', '==', true))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
}

export const getTotalUnreadTickets = async () => {
    const ticketRef = collection(db, 'support-tickets')
    const q = query(ticketRef, where('hasAgentReply', '==', false))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
}