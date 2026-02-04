import { badgeVariants } from "@/components/ui/badge";
import { Ticket } from "@/types/supportTicket";
import { VariantProps } from "class-variance-authority";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
type KnownStatus = 'open' | 'pending' | 'closed' | 'resolved' | 'in_progress';

type KnownPriority = 'urgent' | 'high' | 'medium' | 'low';
export const priorityVariantMap: Record<KnownPriority, BadgeVariant> = {
    urgent: 'destructive',
    high: 'destructive',
    medium: 'secondary',
    low: 'outline',
} as const;

export const charLimit = 2000;
export const statusVariantMap: Record<KnownStatus, BadgeVariant> = {
    open: 'default',
    pending: 'secondary',
    in_progress: 'secondary',
    resolved: 'outline',
    closed: 'outline',
} as const;

export function toPriorityVariant(priority?: string): BadgeVariant {
    const key = (priority ?? '').toLowerCase() as KnownPriority;
    return priorityVariantMap[key] ?? 'outline';
}

export function toStatusVariant(status?: string): BadgeVariant {
    const key = (status ?? '').toLowerCase() as KnownStatus;
    return statusVariantMap[key] ?? 'outline';
}
export type Props = {
    ticket: Ticket;
    action?: string;
};

export const autosize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`; // cap at ~6-8 lines
};