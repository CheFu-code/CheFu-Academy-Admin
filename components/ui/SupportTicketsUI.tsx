import { Copy, KeyRound } from 'lucide-react';
import Header from '../Shared/Header';
import { Button } from './button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './card';
import { Input } from './input';
import { Textarea } from './textarea';
import { Ticket, TicketPriority } from '@/types/supportTicket';
import { copyToClipboard } from '@/helpers/copyToClipboard';

const SupportTicketsUI = ({
    ticketID,
    handleGenerateTicketID,
    submittingTicket,
    submitTicket,
    title,
    setTitle,
    message,
    setMessage,
    priority,
    setPriority,
    userTickets,
    loadingTickets,
}: {
    ticketID: string;
    handleGenerateTicketID: () => void;
    submittingTicket: boolean;
    submitTicket: () => void;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    priority: TicketPriority;
    setPriority: React.Dispatch<React.SetStateAction<TicketPriority>>;
    userTickets: Ticket[];
    loadingTickets: boolean;
}) => {
    return (
        <div className="min-h-screen bg-background p-8">
            <Header
                header="Support Tickets"
                description="When customers have problems, they open support tickets to get help from our team."
            />

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Create New Ticket</CardTitle>
                    <CardDescription>
                        Fill up all the fields here
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex-col space-y-4">
                        <div>
                            <div className="font-semibold flex">
                                Ticket priority{' '}
                                <span className="text-red-400">*</span>
                            </div>
                            <select
                                className="w-full rounded-lg border border-gray-300  px-4 py-2 shadow-sm 
               focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                                required
                                value={priority}
                                onChange={(e) =>
                                    setPriority(
                                        e.target.value as TicketPriority,
                                    )
                                }
                            >
                                <option value="">Select priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <div className="font-semibold">
                                Title <span className="text-red-400">*</span>
                            </div>
                            <Input
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                value={title}
                                placeholder="e.g., System outage report"
                            />
                        </div>

                        <div>
                            <div className="font-semibold">
                                Message <span className="text-red-400">*</span>
                            </div>
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                placeholder="e.g., The system has been offline since 9 AM…"
                                minLength={5}
                            />
                        </div>

                        <div className="font-semibold">
                            Ticket ID: <span className="text-red-400">*</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Input
                                disabled
                                readOnly
                                placeholder={ticketID || 'Generate Ticket ID'}
                                value={ticketID}
                            />
                            <button className="bg-muted-foreground p-1 rounded">
                                <KeyRound
                                    onClick={handleGenerateTicketID}
                                    className="w-5 h-5 text-white hover:text-primary cursor-pointer"
                                />
                            </button>
                        </div>

                        <Button
                            className="mt-4 cursor-pointer"
                            onClick={submitTicket}
                            disabled={
                                submittingTicket ||
                                !ticketID ||
                                !priority ||
                                !title.trim() ||
                                !message.trim()
                            }
                        >
                            {submittingTicket
                                ? 'Submitting...'
                                : 'Submit Ticket'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {loadingTickets ? (
                <p className="text-center text-gray-500 mt-6">
                    Loading your tickets...
                </p>
            ) : userTickets.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">
                    You have not submitted a ticket yet.
                </p>
            ) : (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">
                        Your Previous Tickets
                    </h2>

                    <div className="space-y-4">
                        {userTickets.map((ticket) => (
                            <Card
                                key={ticket.id}
                                className="border rounded-lg shadow-sm"
                            >
                                {/* Header */}
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">
                                        <div className="flex justify-between items-start">
                                            <span className="line-clamp-2">
                                                {ticket.title}
                                            </span>

                                            {/* Priority badge */}
                                            <span
                                                className={`
                                text-xs px-2 py-1 rounded-md ml-2 capitalize
                                ${
                                    ticket.priority === 'high'
                                        ? 'bg-red-100 text-red-700'
                                        : ticket.priority === 'medium'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-gray-400 text-gray-700'
                                }
                            `}
                                            >
                                                {ticket.priority}
                                            </span>
                                        </div>
                                    </CardTitle>

                                    <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                                        Ticket ID: {ticket.id}
                                        <Copy
                                            className="size-4 hover:text-primary cursor-pointer"
                                            onClick={() =>
                                                copyToClipboard(ticket.id)
                                            }
                                        />
                                    </CardDescription>
                                </CardHeader>

                                {/* Content */}
                                <CardContent className="space-y-3">
                                    <p className="text-sm line-clamp-3">
                                        {ticket.message}
                                    </p>

                                    <div className="text-xs text-gray-500 flex flex-col gap-1">
                                        <span>
                                            Status:{' '}
                                            <span className="capitalize font-medium">
                                                {ticket.status}
                                            </span>
                                        </span>

                                        <span>
                                            Created:{' '}
                                            {ticket.createdAt
                                                ? new Date(
                                                      ticket.createdAt,
                                                  ).toLocaleString()
                                                : 'Unknown'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportTicketsUI;
