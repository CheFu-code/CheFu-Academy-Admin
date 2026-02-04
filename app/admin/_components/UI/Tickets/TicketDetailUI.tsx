import Header from '@/components/Shared/Header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Ticket } from '@/types/supportTicket';
import { toPriorityVariant, toStatusVariant } from '@/utils/ticketDetailsUtils';
import { AlertCircle, Copy, Loader, Mail, Reply, X } from 'lucide-react';
import React, { RefObject } from 'react';

const TicketDetailUI = ({
    ticket,
    isReplyMode,
    replyText,
    handleKeyDown,
    handleSubmitReply,
    errorMsg,
    remaining,
    remainingClass,
    handleCopy,
    openReply,
    cancelReply,
    textAreaRef,
    handleChange,
    initials,
    submitting,
    charLimit,
}: {
    ticket: Ticket;
    isReplyMode: boolean;
    replyText: string;
    submitting: boolean;
    handleSubmitReply: () => Promise<void>;
    errorMsg: string | null;
    remaining: number;
    remainingClass: string;
    handleCopy: () => void;
    openReply: () => void;
    cancelReply: () => void;
    textAreaRef: RefObject<HTMLTextAreaElement | null>;
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    initials: string;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    charLimit: number;
}) => {
    return (
        <>
            {isReplyMode ? (
                <Header
                    header="Reply to Ticket"
                    description="Write and send a response to the customer"
                />
            ) : (
                <Header
                    header="Support Ticket"
                    description="View ticket details, status, and customer message"
                />
            )}

            <div className="space-y-6">
                <Card className="shadow-lg border-border/60">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
                        <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 border border-gray-200/50">
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 min-w-0">
                                <div className="flex items-start gap-3 min-w-0">
                                    {/* Avatar, etc. */}
                                    <div className="min-w-0 flex-1">
                                        <CardTitle
                                            className="text-xl leading-tight wrap-break-word line-clamp-2 sm:line-clamp-1"
                                            title={ticket.title}
                                        >
                                            {ticket.title}
                                        </CardTitle>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                                <span className="font-medium">
                                                    {ticket.userName}
                                                </span>
                                            </span>
                                            <span className="hidden sm:inline">
                                                •
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Badge
                                                    variant={toStatusVariant(
                                                        ticket.status,
                                                    )}
                                                    className="capitalize"
                                                >
                                                    {ticket.status}
                                                </Badge>
                                                <Badge
                                                    variant={toPriorityVariant(
                                                        ticket.priority,
                                                    )}
                                                    className="capitalize"
                                                >
                                                    {ticket.priority} Priority
                                                </Badge>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="shrink-0"></div>
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
                                    <X className="size-4" />
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-2">
                        <div className="mb-4 text-sm text-muted-foreground">
                            Ticket ID:{' '}
                            <span className="font-mono text-white rounded-2xl bg-green-400/40 p-1">
                                {ticket.id}
                            </span>
                            <Copy
                                onClick={handleCopy}
                                className="ml-2 inline size-4 cursor-pointer hover:text-primary"
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
                                            to respond to this ticket. Your
                                            message will be sent to the
                                            requester.
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
        </>
    );
};

export default TicketDetailUI;
