import { db } from "@/lib/firebase";
import { Ticket } from "@/types/supportTicket";
import { toJsDate } from "@/utils/toJSDate";
import { collection, doc, FirestoreError, getDoc, limit, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";

export function subscribeToRecentTickets(
    onUpdate: (tickets: Ticket[]) => void,
    onError?: (error: FirestoreError) => void
) {
    const ticketsRef = collection(db, 'support-tickets')
    const q = query(ticketsRef, orderBy('createdAt', 'desc'), limit(3));

    const unsubscribe = onSnapshot(q, (snapshot) => {

        const tickets: Ticket[] = snapshot.docs.map((doc) => {

            const data = doc.data({ serverTimestamps: 'estimate' }) as Partial<Ticket> & {
                createdAt?: Timestamp | number | Date | string | null;
                updatedAt?: Timestamp | number | Date | string | null;
            };


            const createdAt = toJsDate(data.createdAt);
            const updatedAt = toJsDate(data.updatedAt);


            return {
                id: doc.id,
                title: data.title ?? '',
                status: data.status ?? 'open',
                priority: data.priority ?? 'low',
                userName: data.userName ?? '',
                message: data.message ?? '',
                email: data.email ?? '',
                overdue: data.overdue ?? false,
                userId: data.userId ?? '',
                updatedAt,
                createdAt,
            };
        });

        onUpdate(tickets);
    }
        ,
        (error) => {
            if (onError) onError(error);
            else console.error('subscribeToRecentTickets error:', error);
        });

    return unsubscribe;

}

export async function getTicketById(id: string): Promise<Ticket> {
    const docRef = doc(db, 'support-tickets', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data() as Partial<Ticket> & {
            createdAt?: Timestamp | number | Date | string | null;
            updatedAt?: Timestamp | number | Date | string | null;
        };
        const createdAt = toJsDate(data.createdAt);
        const updatedAt = toJsDate(data.updatedAt);
        return {
            id: docSnap.id,
            title: data.title ?? '',
            status: data.status ?? 'open',
            priority: data.priority ?? 'low',
            userName: data.userName ?? '',
            message: data.message ?? '',
            email: data.email ?? '',
            overdue: data.overdue ?? false,
            userId: data.userId ?? '',
            updatedAt,
            createdAt,
        };
    }
    throw new Error(`Ticket with ID ${id} not found`);
}