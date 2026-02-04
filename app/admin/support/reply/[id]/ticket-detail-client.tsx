// app/admin/support/[id]/ticket-detail-client.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea'; // If you have one; else use <textarea>
import { auth } from '@/lib/firebase';
import { Ticket } from '@/types/supportTicket';
import { Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function TicketDetailClient({
    ticket,
    action,
}: {
    ticket: Ticket;
    action?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isReplyMode = useMemo(
        () => (action ?? searchParams.get('action')) === 'reply',
        [action, searchParams],
    );

    useEffect(() => {
        // Optionally focus textarea when opening reply mode
        if (isReplyMode) {
            // ...
        }
    }, [isReplyMode]);

    async function handleSubmitReply() {
        if (!replyText.trim()) return;
        setSubmitting(true);
        try {
            // Call your API route to persist the reply
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
            // After success: clear input, remove ?action=reply, and/or refresh data
            setReplyText('');
            const newUrl = `/admin/support/reply/${ticket.id}`; // strip query
            router.replace(newUrl); // or router.refresh() if you prefer
        } catch (e) {
            console.error(e);
            alert('Failed to send reply');
        } finally {
            setSubmitting(false);
        }
    }

    function openReply() {
        const url = `/admin/support/reply/${ticket.id}?action=reply`;
        router.replace(url);
    }

    function cancelReply() {
        const url = `/admin/support/reply/${ticket.id}`;
        router.replace(url);
    }

    return (
        <div className="space-y-6">
            <Card className="shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    {!isReplyMode ? (
                        <Button onClick={openReply} className="cursor-pointer">
                            Reply
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={cancelReply}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        From:{' '}
                        <span className="font-medium">{ticket.userName}</span> •
                        Priority: {ticket.priority} • Status: {ticket.status}
                    </div>

                    {/* Reply UI (inline) */}
                    {isReplyMode && (
                        <div className="mt-4 space-y-2">
                            {/* Use your own Textarea or plain textarea */}
                            {'Textarea' in
                            (globalThis as Record<string, unknown>) ? (
                                // If you have your ShadCN Textarea component
                                <Textarea
                                    value={replyText}
                                    onChange={(e) =>
                                        setReplyText(e.target.value)
                                    }
                                    placeholder="Write your reply…"
                                    rows={4}
                                />
                            ) : (
                                <textarea
                                    className="w-full rounded-md border bg-background p-2 text-sm"
                                    rows={4}
                                    value={replyText}
                                    onChange={(e) =>
                                        setReplyText(e.target.value)
                                    }
                                    placeholder="Write your reply…"
                                />
                            )}
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSubmitReply}
                                    disabled={submitting || !replyText.trim()}
                                    className="cursor-pointer"
                                >
                                    {submitting ? (
                                        <Loader className="mr-2 size-4 animate-spin" />
                                    ) : null}
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
                </CardContent>
            </Card>
        </div>
    );
}
