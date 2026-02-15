import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import type {
    AudienceUser,
    CampaignType,
    EmailPreferenceKey,
    PreferenceAudience,
    SetFormField,
} from "./types";

type AudienceTabProps = {
    type: CampaignType;
    form: {
        fromName: string;
        fromEmail: string;
        replyTo: string;
        audience: PreferenceAudience;
    };
    setField: SetFormField;
    loadingAudienceUsers: boolean;
    recipientEmails: string[];
    recipientPreferenceKey: EmailPreferenceKey;
};

export function AudienceTab({
    type,
    form,
    setField,
    loadingAudienceUsers,
    recipientEmails,
    recipientPreferenceKey,
}: AudienceTabProps) {
    return (
        <TabsContent value="audience" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-slate-800/60 bg-slate-900/40">
                    <CardHeader>
                        <CardTitle className="text-base">From & Routing</CardTitle>
                        <CardDescription>Sender identity and reply-to.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Label>From Name</Label>
                                <Input
                                    value={form.fromName}
                                    onChange={(e) => setField("fromName", e.target.value)}
                                    placeholder="e.g., Marketing Team"
                                />
                            </div>
                            <div>
                                <Label>From Email</Label>
                                <Select
                                    value={form.fromEmail}
                                    onValueChange={(v) => setField("fromEmail", v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select address" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="marketing@chefuinc.com">marketing@chefuinc.com</SelectItem>
                                        <SelectItem value="no-reply@chefuinc.com">no-reply@chefuinc.com</SelectItem>
                                        <SelectItem value="hello@chefuinc.com">hello@chefuinc.com</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>Reply-To</Label>
                            <Input
                                value={form.replyTo}
                                onChange={(e) => setField("replyTo", e.target.value)}
                                placeholder="support@chefuinc.com"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-800/60 bg-slate-900/40">
                    <CardHeader>
                        <CardTitle className="text-base">Audience</CardTitle>
                        <CardDescription>Select the recipient list.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Audience</Label>
                            <Select
                                value={form.audience}
                                onValueChange={(v) => setField("audience", v as PreferenceAudience)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose audience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All Subscribers">All Subscribers</SelectItem>
                                    <SelectItem value="Customers (All)">Customers (All)</SelectItem>
                                    <SelectItem value="General Subscribers">General Subscribers</SelectItem>
                                    <SelectItem value="Marketing Subscribers">Marketing Subscribers</SelectItem>
                                    <SelectItem value="Security Subscribers">Security Subscribers</SelectItem>
                                    <SelectItem value="Activity Subscribers">Activity Subscribers</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="rounded-md border border-slate-800/60 bg-slate-950/50 p-3 text-xs text-slate-300">
                            {loadingAudienceUsers ? (
                                <span>Checking Firestore recipients...</span>
                            ) : (
                                <span>
                                    {recipientEmails.length} recipient(s) will receive this {type} email
                                    ({form.audience}, requires <code>emailPreferences.{recipientPreferenceKey} = true</code>).
                                </span>
                            )}
                            {!loadingAudienceUsers && recipientEmails.length > 0 && (
                                <div className="mt-2 text-slate-400">
                                    {recipientEmails.slice(0, 5).join(", ")}
                                    {recipientEmails.length > 5 ? " ..." : ""}
                                </div>
                            )}
                        </div>
                        <div className="text-xs text-slate-400">
                            Tip: Avoid spam, honor opt-outs, and include an unsubscribe link.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
