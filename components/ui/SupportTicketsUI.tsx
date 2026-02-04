import { KeyRound } from 'lucide-react';
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
import { TicketPriority } from '@/types/supportTicket';

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
        </div>
    );
};

export default SupportTicketsUI;
