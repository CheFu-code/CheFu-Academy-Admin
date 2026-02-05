// utils/ticketSLA.ts
import { TicketPriority, TicketStatus } from '@/types/supportTicket';

export const SLA_HOURS_BY_PRIORITY: Record<TicketPriority, number> = {
    low: 72,
    medium: 48,
    high: 24,
    urgent: 8,
};

export const computeOverdue = (
    updatedAtISO: string,
    priorityValue: TicketPriority,
    statusValue: TicketStatus,
): boolean => {
    if (statusValue === 'resolved' || statusValue === 'closed') return false;

    const slaHours = SLA_HOURS_BY_PRIORITY[priorityValue] ?? 48;
    const updatedAt = new Date(updatedAtISO).getTime();
    const now = Date.now();
    const hoursElapsed = (now - updatedAt) / (1000 * 60 * 60);
    return hoursElapsed > slaHours;
};