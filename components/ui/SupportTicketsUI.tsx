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

const SupportTicketsUI = ({
    ticketID,
    generateTicketID,
    submittingTicket,
    submitTicket,
    title,
    setTitle,
    message,
    setMessage,
}: {
    ticketID: string;
    generateTicketID: () => void;
    submittingTicket: boolean;
    submitTicket: () => void;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
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
                                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
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

                        <div className="font-semibold">Ticket ID:</div>
                        <div className="flex items-center gap-4">
                            <Input
                                disabled
                                readOnly
                                placeholder={ticketID || 'Generate Ticket ID'}
                                value={ticketID}
                            />
                            <div className="bg-muted-foreground p-1 rounded">
                                <KeyRound
                                    onClick={generateTicketID}
                                    className="w-5 h-5 text-white hover:text-primary cursor-pointer"
                                />
                            </div>
                        </div>

                        <Button
                            className="mt-4 cursor-pointer"
                            onClick={submitTicket}
                            disabled={
                                submittingTicket ||
                                !ticketID ||
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
