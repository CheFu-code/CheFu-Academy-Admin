import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2, Send, TimerReset } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { EmailFormState, SetFormField } from "./types";

type ScheduleTabProps = {
    form: EmailFormState;
    setField: SetFormField;
    scheduleTime: string;
    setScheduleTime: (value: string) => void;
    defaultScheduleTime: string;
    scheduleLabel: string;
    combineDateAndTime: (date: Date, timeValue: string) => Date;
    canSend: boolean;
    loadingAudienceUsers: boolean;
    recipientCount: number;
    handleSaveDraft: () => Promise<void>;
    handleSendNow: () => Promise<void>;
};

export function ScheduleTab({
    form,
    setField,
    scheduleTime,
    setScheduleTime,
    defaultScheduleTime,
    scheduleLabel,
    combineDateAndTime,
    canSend,
    loadingAudienceUsers,
    recipientCount,
    handleSaveDraft,
    handleSendNow,
}: ScheduleTabProps) {
    return (
        <TabsContent value="schedule" className="mt-6">
            <Card className="border-slate-800/60 bg-slate-900/40">
                <CardHeader>
                    <CardTitle className="text-base">Schedule & Send</CardTitle>
                    <CardDescription>Pick a time or send immediately.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Select
                                value={form.timezone}
                                onValueChange={(v) => setField("timezone", v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Africa/Johannesburg">Africa/Johannesburg</SelectItem>
                                    <SelectItem value="UTC">UTC</SelectItem>
                                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Date & Time</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between border-slate-700 bg-slate-900/30 hover:bg-slate-900/40"
                                    >
                                        <span>{scheduleLabel}</span>
                                        <CalendarIcon className="h-4 w-4 ml-2" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-3 space-y-3" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={form.scheduleAt}
                                        onSelect={(d) => {
                                            if (!d) {
                                                setField("scheduleAt", undefined);
                                                return;
                                            }
                                            setField("scheduleAt", combineDateAndTime(d, scheduleTime));
                                        }}
                                        autoFocus
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="schedule-time">Time</Label>
                                        <Input
                                            id="schedule-time"
                                            type="time"
                                            value={scheduleTime}
                                            onChange={(e) => {
                                                const nextTime = e.target.value || defaultScheduleTime;
                                                setScheduleTime(nextTime);

                                                const baseDate = form.scheduleAt ?? new Date();
                                                setField("scheduleAt", combineDateAndTime(baseDate, nextTime));
                                            }}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Smart timing</Label>
                            <Button variant="ghost" className="w-full border border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/40">
                                <TimerReset className="mr-2 h-4 w-4" />
                                Predict best time (beta)
                            </Button>
                        </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Button variant="outline" onClick={handleSaveDraft}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Save draft
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleSendNow}
                            disabled={!canSend || loadingAudienceUsers || recipientCount === 0}
                            className={cn((!canSend || loadingAudienceUsers || recipientCount === 0) && "opacity-60")}
                        >
                            <Send className="mr-2 h-4 w-4" />
                            Send now
                        </Button>
                        <Button
                            onClick={() => {
                                if (!form.scheduleAt) {
                                    toast.error("Pick a schedule date/time first.");
                                    return;
                                }
                                toast.success(`Scheduled for ${scheduleLabel} (${form.timezone})`);
                            }}
                            className="bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Schedule
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
