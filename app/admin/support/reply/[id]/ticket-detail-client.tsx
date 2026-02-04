// app/admin/support/[id]/ticket-detail-client.tsx
'use client';

import { AlertCircle, Copy, Loader, Mail, Reply, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { auth } from '@/lib/firebase';
import { Ticket } from '@/types/supportTicket';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { charLimit, priorityVariantMap } from '@/utils/ticketDetailsUtils';

type Props = {
    ticket: Ticket;
    action?: string;
};

export default function TicketDetailClient({ ticket, action }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    // const { toast } = useToast();

    const isReplyMode = useMemo(
        () => (action ?? searchParams.get('action')) === 'reply',
        [action, searchParams],
    );

    // Focus textarea & autosize on open
    useEffect(() => {
        if (isReplyMode && textAreaRef.current) {
            textAreaRef.current.focus();
            autosize(textAreaRef.current);
        }
    }, [isReplyMode]);

    // Simple autosize behavior
    const autosize = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 240)}px`; // cap at ~6-8 lines
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReplyText(e.target.value);
        if (textAreaRef.current) autosize(textAreaRef.current);
    };

    const getBasePath = useCallback(
        () => `/admin/support/reply/${ticket.id}`,
        [ticket.id],
    );

    const openReply = () => {
        router.replace(`${getBasePath()}?action=reply`);
    };

    const cancelReply = () => {
        setReplyText('');
        setErrorMsg(null);
        router.replace(getBasePath());
    };

    const handleSubmitReply = async () => {
        if (!replyText.trim()) return;
        setSubmitting(true);
        setErrorMsg(null);

        try {
            const token = await auth.currentUser?.getIdToken?.();
            const res = await fetch(`/api/support/${ticket.id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ message: replyText }),
            });

            if (!res.ok) throw new Error('Failed to send reply');

            setReplyText('');
            // toast?.({ title: 'Reply sent', description: 'Your response was posted.' });
            router.replace(getBasePath()); // strip query
            // Optionally refresh if server actions update data immediately
            // router.refresh();
        } catch (e) {
            console.error(e);
            setErrorMsg('Could not send your reply. Please try again.');
            // toast?.({
            //   title: 'Failed to send reply',
            //   description: 'Please check your connection and try again.',
            //   variant: 'destructive',
            // });
        } finally {
            setSubmitting(false);
        }
    };

    // Cmd/Ctrl+Enter to send
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'enter') {
            e.preventDefault();
            if (!submitting && replyText.trim()) {
                void handleSubmitReply();
            }
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(ticket.id).then(
            () => {
                toast.success('Copied to clipboard');
            },
            () => {
                toast.error('Failed to copy ticket ID to clipboard');
            },
        );
    };

    const priority = ticket.priority?.toLowerCase() || 'low';
    const priorityVariant = priorityVariantMap[priority] ?? 'outline';
    const statusVariant =
        ticket.status?.toLowerCase() === 'open'
            ? 'default'
            : ticket.status?.toLowerCase() === 'pending'
              ? 'secondary'
              : 'outline';
    const initials = (ticket.userName ?? 'U')
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const remaining = charLimit - replyText.length;
    const remainingClass =
        remaining < 0
            ? 'text-destructive'
            : remaining < 100
              ? 'text-amber-600'
              : 'text-muted-foreground';

    return (
        <div className="space-y-6">
            <Card className="shadow-lg border-border/60">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border border-gray-200/50">
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <CardTitle className="text-xl leading-tight">
                                {ticket.title}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    <span className="font-medium">
                                        {ticket.userName}
                                    </span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-2">
                                    <Badge
                                        variant={statusVariant as any}
                                        className="capitalize"
                                    >
                                        {ticket.status}
                                    </Badge>
                                    <Badge
                                        variant={priorityVariant as any}
                                        className="capitalize"
                                    >
                                        {ticket.priority} Priority
                                    </Badge>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {!isReplyMode ? (
                            <Button
                                onClick={openReply}
                                className="cursor-pointer"
                                size="sm"
                            >
                                <Reply className="mr-2 h-4 w-4" />
                                Reply
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={cancelReply}
                                className="cursor-pointer"
                                size="sm"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="pt-2">
                    <div className="mb-4 text-sm text-muted-foreground">
                        Ticket ID:{' '}
                        <span className="font-mono text-white rounded-2xl bg-green-400/10 p-1">
                            {ticket.id}
                        </span>
                        <Copy
                            onClick={handleCopy}
                            className="ml-2 inline size-4 cursor-pointer"
                        />
                    </div>

                    <Separator className="my-4" />

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <ScrollArea className="h-70 rounded-md border bg-card p-2">
                                {ticket.message ? (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="mt-2 whitespace-pre-wrap">
                                            {ticket.message}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                        No message content available.
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Reply panel */}
                        <div className="lg:col-span-1">
                            {!isReplyMode ? (
                                <div className="rounded-md border bg-muted/40 p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Click{' '}
                                        <span className="font-medium">
                                            Reply
                                        </span>{' '}
                                        to respond to this ticket. Your message
                                        will be sent to the requester.
                                    </p>
                                    <div className="mt-3">
                                        <Button
                                            onClick={openReply}
                                            className="w-full cursor-pointer"
                                        >
                                            <Reply className="mr-2 h-4 w-4" />
                                            Reply
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-md border p-4">
                                    <label
                                        htmlFor="reply"
                                        className="mb-2 block text-sm font-medium"
                                    >
                                        Your reply
                                    </label>
                                    <Textarea
                                        id="reply"
                                        ref={textAreaRef}
                                        value={replyText}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Write your reply…"
                                        className="min-h-24 resize-none"
                                        aria-invalid={
                                            !!errorMsg ||
                                            replyText.length > charLimit
                                        }
                                        maxLength={charLimit + 500} // hard cap safety
                                    />

                                    <div className="mt-2 flex items-center justify-between">
                                        <p
                                            className={`text-xs ${remainingClass}`}
                                        >
                                            {remaining} characters left
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Cmd/Ctrl + Enter to send
                                        </p>
                                    </div>

                                    {errorMsg ? (
                                        <div className="mt-3 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-2 text-destructive">
                                            <AlertCircle className="mt-0.5 h-4 w-4" />
                                            <span className="text-sm">
                                                {errorMsg}
                                            </span>
                                        </div>
                                    ) : null}

                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            onClick={handleSubmitReply}
                                            disabled={
                                                submitting ||
                                                !replyText.trim() ||
                                                replyText.length > charLimit
                                            }
                                            className="cursor-pointer"
                                        >
                                            {submitting ? (
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Reply className="mr-2 h-4 w-4" />
                                            )}
                                            Send Reply
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={cancelReply}
                                            className="cursor-pointer"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
