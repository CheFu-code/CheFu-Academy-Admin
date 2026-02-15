'use client'

import * as React from "react";
import { useMemo, useState, useCallback, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { collection, getDocs } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Send, Eye, Upload, FlaskConical, Link2, Rocket, TimerReset, Smartphone, Monitor, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { db } from "@/lib/firebase";
import { SegmentSelector, TemplateDropdown, EmailPreview, PreviewSheet } from "./sub-components";

type CampaignType = "general" | "marketing";
type EmailPreferenceKey = CampaignType | "activity" | "security";

type AudienceUser = {
    id: string;
    email: string;
    member?: boolean;
    subscriptionStatus?: string;
    emailPreferences?: Partial<Record<EmailPreferenceKey, boolean>>;
};

const isCustomer = (user: AudienceUser) => {
    if (user.member === true) return true;
    const status = (user.subscriptionStatus ?? "").trim().toLowerCase();
    return status.length > 0 && status !== "free" && status !== "none";
};

export function MainPanel() {
    const DEFAULT_SCHEDULE_TIME = "09:00";
    const [type, setType] = useState<CampaignType>("general");
    const [activeTab, setActiveTab] = useState<"audience" | "compose" | "preview" | "schedule">(
        "compose"
    );
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

    const [form, setForm] = useState({
        fromName: "Marketing Team",
        fromEmail: "marketing@chefuinc.com",
        replyTo: "support@chefuinc.com",
        audience: "All Subscribers",
        segments: ["Active", "Last 90 days"],
        subjectA: "",
        subjectB: "",
        preheader: "",
        contentA: "",
        contentB: "",
        promoCode: "",
        utmSource: "newsletter",
        utmMedium: "email",
        utmCampaign: "",
        trackOpens: true,
        trackClicks: true,
        enableAB: false,
        sendTestTo: "",
        scheduleAt: undefined as Date | undefined,
        timezone: "Africa/Johannesburg",
    });

    const [files, setFiles] = useState<File[]>([]);
    const [scheduleTime, setScheduleTime] = useState(DEFAULT_SCHEDULE_TIME);
    const [audienceUsers, setAudienceUsers] = useState<AudienceUser[]>([]);
    const [loadingAudienceUsers, setLoadingAudienceUsers] = useState(false);

    useEffect(() => {
        let mounted = true;
        const loadAudienceUsers = async () => {
            setLoadingAudienceUsers(true);
            try {
                const snap = await getDocs(collection(db, "users"));
                if (!mounted) return;
                const users = snap.docs
                    .map((docSnap) => {
                        const data = docSnap.data() as Partial<AudienceUser>;
                        const email =
                            typeof data.email === "string" && data.email.includes("@")
                                ? data.email
                                : docSnap.id;
                        return {
                            id: docSnap.id,
                            email,
                            member: data.member === true,
                            subscriptionStatus:
                                typeof data.subscriptionStatus === "string"
                                    ? data.subscriptionStatus
                                    : "",
                            emailPreferences: data.emailPreferences,
                        };
                    })
                    .filter((u) => typeof u.email === "string" && u.email.includes("@"));
                setAudienceUsers(users);
            } catch (error) {
                console.error("Failed to load users for email audience:", error);
                toast.error("Unable to load audience from Firestore.");
            } finally {
                if (mounted) {
                    setLoadingAudienceUsers(false);
                }
            }
        };
        loadAudienceUsers();
        return () => {
            mounted = false;
        };
    }, []);

    const recipientEmails = useMemo(() => {
        const audienceBase = (() => {
            if (form.audience === "Customers (All)") {
                return audienceUsers.filter(isCustomer);
            }
            if (form.audience.startsWith("Leads")) {
                return audienceUsers.filter((u) => !isCustomer(u));
            }
            return audienceUsers;
        })();

        const eligible = audienceBase.filter((u) => u.emailPreferences?.[type] === true);
        return Array.from(new Set(eligible.map((u) => u.email)));
    }, [audienceUsers, form.audience, type]);

    const onDrop = useCallback((accepted: File[]) => {
        setFiles((prev) => [
            ...prev,
            ...accepted.filter((f) => !prev.find((p) => p.name === f.name)),
        ]);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "image/*": [".png", ".jpg", ".jpeg", ".gif"],
            "text/plain": [".txt"],
            "application/zip": [".zip"],
        },
    });

    const removeFile = (name: string) => {
        setFiles((prev) => prev.filter((f) => f.name !== name));
    };

    const scheduleLabel = useMemo(
        () => (form.scheduleAt ? format(form.scheduleAt, "EEE, MMM d yyyy HH:mm") : "Pick date & time"),
        [form.scheduleAt]
    );

    const combineDateAndTime = useCallback((date: Date, timeValue: string) => {
        const [hourPart, minutePart] = timeValue.split(":");
        const hours = Number.parseInt(hourPart ?? "0", 10);
        const minutes = Number.parseInt(minutePart ?? "0", 10);
        const next = new Date(date);
        next.setHours(Number.isNaN(hours) ? 0 : hours, Number.isNaN(minutes) ? 0 : minutes, 0, 0);
        return next;
    }, []);

    const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
        setForm((f) => ({ ...f, [key]: value }));

    const canSend =
        (form.subjectA?.trim()?.length ?? 0) > 0 &&
        (form.contentA?.trim()?.length ?? 0) > 0 &&
        form.fromEmail.includes("@");

    async function handleSendNow() {
        if (!canSend) {
            toast.error("Please complete required fields: From, Subject, Content.");
            return;
        }
        if (loadingAudienceUsers) {
            toast.error("Still loading users from Firestore. Please wait.");
            return;
        }
        if (recipientEmails.length === 0) {
            toast.error(`No recipients match ${form.audience} with emailPreferences.${type}=true.`);
            return;
        }
        try {
            // TODO: Replace with your API call
            // await api.post("/emails/send", payload)
            await new Promise((r) => setTimeout(r, 800));
            toast.success(`Email sent to ${recipientEmails.length} recipient(s).`);
        } catch (e) {
            toast.error("Failed to send. Check logs and try again.");
            console.log(e)
        }
    }

    async function handleSaveDraft() {
        try {
            // await api.post("/emails/draft", payload)
            await new Promise((r) => setTimeout(r, 500));
            toast.success("Draft saved.");
        } catch {
            toast.error("Could not save draft.");
        }
    }

    async function handleSendTest() {
        if (!form.sendTestTo || !form.sendTestTo.includes("@")) {
            toast.error("Enter a valid test email address.");
            return;
        }
        try {
            // await api.post("/emails/test", { to: form.sendTestTo, ...payload })
            await new Promise((r) => setTimeout(r, 600));
            toast.success(`Test email sent to ${form.sendTestTo}.`);
        } catch {
            toast.error("Failed to send test email.");
        }
    }

    return (
        <div className="space-y-6">
            <Card className="border-slate-800/60 bg-slate-900/40 backdrop-blur">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Rocket className="h-5 w-5 text-cyan-300" />
                                Send Emails
                            </CardTitle>
                            <CardDescription>
                                Choose type, set audience, compose content, preview and schedule.
                            </CardDescription>
                        </div>
                        <Tabs
                            value={type}
                            onValueChange={(val) => setType(val as CampaignType)}
                            className="w-fit"
                        >
                            <TabsList className="bg-slate-800/70">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <Tabs
                        value={activeTab}
                        onValueChange={(val) => setActiveTab(val as "audience" | "compose" | "preview" | "schedule")}
                        className="w-full"
                    >
                        <TabsList className="bg-slate-800/70">
                            <TabsTrigger value="audience">Audience</TabsTrigger>
                            <TabsTrigger value="compose">Compose</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="schedule">Schedule</TabsTrigger>
                        </TabsList>

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
                                        <CardTitle className="text-base">Audience & Segments</CardTitle>
                                        <CardDescription>Select list and refine with segments.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label>Audience</Label>
                                            <Select
                                                value={form.audience}
                                                onValueChange={(v) => setField("audience", v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose audience" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="All Subscribers">All Subscribers</SelectItem>
                                                    <SelectItem value="Customers (All)">Customers (All)</SelectItem>
                                                    <SelectItem value="Leads (North Region)">Leads (North Region)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Segments</Label>
                                            <SegmentSelector
                                                values={form.segments}
                                                onChange={(v) => setField("segments", v)}
                                            />
                                        </div>
                                        <div className="rounded-md border border-slate-800/60 bg-slate-950/50 p-3 text-xs text-slate-300">
                                            {loadingAudienceUsers ? (
                                                <span>Checking Firestore recipients...</span>
                                            ) : (
                                                <span>
                                                    {recipientEmails.length} recipient(s) will receive this {type} email
                                                    ({form.audience}, requires <code>emailPreferences.{type} = true</code>).
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
                                            Tip: Keep segments small and precise. Avoid spam—honor opt-outs and include an unsubscribe link.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="compose" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                                <Card className="border-slate-800/60 bg-slate-900/40">
                                    <CardHeader>
                                        <CardTitle className="text-base">Content</CardTitle>
                                        <CardDescription>Subject, preheader, body & attachments.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Subject {form.enableAB && <Badge className="ml-2">Variant A</Badge>}</Label>
                                                <Input
                                                    value={form.subjectA}
                                                    onChange={(e) => setField("subjectA", e.target.value)}
                                                    placeholder="Subject line"
                                                />
                                            </div>
                                            {form.enableAB && (
                                                <div>
                                                    <Label>Subject <Badge className="ml-2">Variant B</Badge></Label>
                                                    <Input
                                                        value={form.subjectB}
                                                        onChange={(e) => setField("subjectB", e.target.value)}
                                                        placeholder="Subject B"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Preheader</Label>
                                            <Input
                                                value={form.preheader}
                                                onChange={(e) => setField("preheader", e.target.value)}
                                                placeholder="Short preview text"
                                            />
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label>Body {form.enableAB && <Badge className="ml-2">Variant A</Badge>}</Label>
                                                    <TemplateDropdown onSelectTemplate={(tmpl) => setField("contentA", tmpl)} />
                                                </div>
                                                <Textarea
                                                    className="min-h-55"
                                                    value={form.contentA}
                                                    onChange={(e) => setField("contentA", e.target.value)}
                                                    placeholder="Write or paste your HTML/text content here…"
                                                />
                                            </div>
                                            {form.enableAB && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label>Body <Badge className="ml-2">Variant B</Badge></Label>
                                                        <TemplateDropdown onSelectTemplate={(tmpl) => setField("contentB", tmpl)} />
                                                    </div>
                                                    <Textarea
                                                        className="min-h-55"
                                                        value={form.contentB}
                                                        onChange={(e) => setField("contentB", e.target.value)}
                                                        placeholder="Variant B content…"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {type === "marketing" && (
                                                <div>
                                                    <Label>Promo Code (optional)</Label>
                                                    <Input
                                                        value={form.promoCode}
                                                        onChange={(e) => setField("promoCode", e.target.value)}
                                                        placeholder="e.g., SAVE20"
                                                    />
                                                </div>
                                            )}

                                            <div className="rounded-lg border border-slate-800/60">
                                                <div
                                                    {...getRootProps()}
                                                    className={cn(
                                                        "p-4 rounded-lg text-sm cursor-pointer transition-colors",
                                                        isDragActive
                                                            ? "bg-cyan-900/30 border-cyan-700"
                                                            : "bg-slate-900/20"
                                                    )}
                                                >
                                                    <input {...getInputProps()} />
                                                    <div className="flex items-center gap-2 text-slate-300">
                                                        <Upload className="h-4 w-4 text-cyan-300" />
                                                        <span>
                                                            {isDragActive
                                                                ? "Drop files to attach…"
                                                                : "Drag & drop or click to attach files"}
                                                        </span>
                                                    </div>
                                                </div>
                                                {files.length > 0 && (
                                                    <div className="p-3">
                                                        <div className="text-xs text-slate-400 mb-2">Attachments</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {files.map((f) => (
                                                                <Badge
                                                                    key={f.name}
                                                                    className="bg-slate-800 text-slate-200 border border-slate-700"
                                                                >
                                                                    {f.name}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="ml-2 h-5 w-5 text-slate-300 hover:text-white"
                                                                        onClick={() => removeFile(f.name)}
                                                                    >
                                                                        <X className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-800/60 bg-slate-900/40">
                                    <CardHeader>
                                        <CardTitle className="text-base">Tracking & Options</CardTitle>
                                        <CardDescription>Analytics, A/B, and UTM.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label className="flex items-center gap-2">
                                                    <Eye className="h-4 w-4 text-cyan-300" /> Track opens
                                                </Label>
                                                <p className="text-xs text-slate-400">
                                                    Adds a small tracking pixel to measure open rates.
                                                </p>
                                            </div>
                                            <Switch
                                                checked={form.trackOpens}
                                                onCheckedChange={(v) => setField("trackOpens", v)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Label className="flex items-center gap-2">
                                                    <Link2 className="h-4 w-4 text-cyan-300" /> Track clicks
                                                </Label>
                                                <p className="text-xs text-slate-400">
                                                    Wraps links to capture click analytics.
                                                </p>
                                            </div>
                                            <Switch
                                                checked={form.trackClicks}
                                                onCheckedChange={(v) => setField("trackClicks", v)}
                                            />
                                        </div>

                                        <Separator className="bg-slate-800" />

                                        {type === "marketing" && (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <Label className="flex items-center gap-2">
                                                            <FlaskConical className="h-4 w-4 text-cyan-300" /> Enable A/B test
                                                        </Label>
                                                        <p className="text-xs text-slate-400">
                                                            Test subject/content variants on a sample, send winner to remainder.
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        checked={form.enableAB}
                                                        onCheckedChange={(v) => setField("enableAB", v)}
                                                    />
                                                </div>

                                                <div className="grid sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <Label>UTM Source</Label>
                                                        <Input
                                                            value={form.utmSource}
                                                            onChange={(e) => setField("utmSource", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>UTM Medium</Label>
                                                        <Input
                                                            value={form.utmMedium}
                                                            onChange={(e) => setField("utmMedium", e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>UTM Campaign</Label>
                                                        <Input
                                                            value={form.utmCampaign}
                                                            onChange={(e) => setField("utmCampaign", e.target.value)}
                                                            placeholder="spring_sale_2026"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <Separator className="bg-slate-800" />

                                        <div className="space-y-2">
                                            <Label>Send test email</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={form.sendTestTo}
                                                    onChange={(e) => setField("sendTestTo", e.target.value)}
                                                    placeholder="name@chefuinc.com"
                                                />
                                                <Button variant="secondary" onClick={handleSendTest}>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Send test
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="mt-6">
                            <Card className="border-slate-800/60 bg-slate-900/40">
                                <CardHeader className="flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">Live Preview</CardTitle>
                                        <CardDescription>Subject & body render</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                                            onClick={() => setPreviewDevice("desktop")}
                                        >
                                            <Monitor className="mr-2 h-4 w-4" />
                                            Desktop
                                        </Button>
                                        <Button
                                            variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                                            onClick={() => setPreviewDevice("mobile")}
                                        >
                                            <Smartphone className="mr-2 h-4 w-4" />
                                            Mobile
                                        </Button>
                                        <PreviewSheet subject={form.subjectA} preheader={form.preheader} content={form.contentA} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <EmailPreview
                                        device={previewDevice}
                                        subject={form.subjectA}
                                        preheader={form.preheader}
                                        content={form.contentA}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

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
                                                                const nextTime = e.target.value || DEFAULT_SCHEDULE_TIME;
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
                                            disabled={!canSend || loadingAudienceUsers || recipientEmails.length === 0}
                                            className={cn((!canSend || loadingAudienceUsers || recipientEmails.length === 0) && "opacity-60")}
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
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

