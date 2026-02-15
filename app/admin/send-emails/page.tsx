'use client'

import * as React from "react";
import { useMemo, useState, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils"; // if you have a classnames helper; else remove
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Mail, Settings, Users, Send, Eye, Upload, Sparkles, FlaskConical, Link2, Rocket, TimerReset, Smartphone, Monitor, FileText, FolderUp, CheckCircle2, X, Wand2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Types (remove if using .jsx)
type CampaignType = "general" | "marketing";

export default function SendEmails() {
    return (
        <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            <AuroraBackground />
            <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-10 py-8">
                <HeaderBar />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-6">
                    <SidebarNav />
                    <MainPanel />
                </div>
            </div>
        </div>
    );
}

/* ----------------------------- HEADER & SIDEBAR ---------------------------- */

function HeaderBar() {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur supports-backdrop-filter:bg-slate-900/40 px-3 sm:px-5 py-3 shadow-[0_0_50px_-15px_rgba(56,189,248,0.20)]">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Sparkles className="h-6 w-6 text-cyan-300" />
                    <span className="absolute -inset-2 rounded-full blur-md bg-cyan-500/20" />
                </div>
                <div className="font-semibold tracking-tight">
                    Orion Mail Console
                </div>
                <Badge variant="secondary" className="ml-2 bg-slate-800/70 border border-slate-700 text-slate-200">
                    Admin
                </Badge>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Settings</TooltipContent>
                </Tooltip>
                <Button variant="outline" className="border-cyan-600/40 bg-cyan-900/10 hover:bg-cyan-900/20 text-cyan-200">
                    <FolderUp className="mr-2 h-4 w-4" />
                    Import CSV
                </Button>
                <Button className="bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500">
                    <Wand2 className="mr-2 h-4 w-4" />
                    New Template
                </Button>
            </div>
        </div>
    );
}

function SidebarNav() {
    const items = [
        { icon: <Mail className="h-4 w-4" />, label: "Send Email" },
        { icon: <Users className="h-4 w-4" />, label: "Audiences" },
        { icon: <FileText className="h-4 w-4" />, label: "Templates" },
        { icon: <FlaskConical className="h-4 w-4" />, label: "Experiments" },
        { icon: <Settings className="h-4 w-4" />, label: "Settings" },
    ];
    return (
        <Card className="border-slate-800/60 bg-slate-900/40 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-base">Navigation</CardTitle>
                <CardDescription>Quick access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {items.map((item, idx) => (
                    <Button
                        key={idx}
                        variant={idx === 0 ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start",
                            idx === 0
                                ? "bg-slate-800/70 text-white border border-slate-700"
                                : "text-slate-300 hover:text-white"
                        )}
                    >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                    </Button>
                ))}
                <Separator className="my-3 bg-slate-800" />
                <div className="text-xs text-slate-400">
                    Tip: Press <kbd className="rounded bg-slate-800 px-1.5 py-0.5">/</kbd> to open command palette.
                </div>
            </CardContent>
        </Card>
    );
}

/* --------------------------------- MAIN UI -------------------------------- */

function MainPanel() {
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
        try {
            // TODO: Replace with your API call
            // await api.post("/emails/send", payload)
            await new Promise((r) => setTimeout(r, 800));
            toast.success("Email sent to selected audience.");
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
            {/* Campaign header */}
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
                        onValueChange={(val) => setActiveTab(val as any)}
                        className="w-full"
                    >
                        <TabsList className="bg-slate-800/70">
                            <TabsTrigger value="audience">Audience</TabsTrigger>
                            <TabsTrigger value="compose">Compose</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="schedule">Schedule</TabsTrigger>
                        </TabsList>

                        {/* Audience */}
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
                                        <div className="text-xs text-slate-400">
                                            Tip: Keep segments small and precise. Avoid spam—honor opt-outs and include an unsubscribe link.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Compose */}
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

                        {/* Preview */}
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

                        {/* Schedule */}
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
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={form.scheduleAt}
                                                        onSelect={(d) => setField("scheduleAt", d)}
                                                        initialFocus
                                                    />
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
                                            disabled={!canSend}
                                            className={cn(!canSend && "opacity-60")}
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

/* ------------------------------ SUB COMPONENTS ----------------------------- */

function SegmentSelector({
    values,
    onChange,
}: {
    values: string[];
    onChange: (v: string[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const all = ["Active", "Churn-risk", "VIP", "Last 30 days", "Last 90 days", "Trial users", "EU Region"];
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between border-slate-700 bg-slate-900/30 hover:bg-slate-900/40">
                    <span className="truncate">
                        {values.length ? values.join(", ") : "Add segments"}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-70 p-0">
                <ScrollArea className="max-h-65">
                    <div className="p-2 space-y-1">
                        {all.map((seg) => {
                            const active = values.includes(seg);
                            return (
                                <Button
                                    key={seg}
                                    variant="ghost"
                                    className={cn("w-full justify-between", active && "bg-slate-800")}
                                    onClick={() => {
                                        onChange(
                                            active ? values.filter((v) => v !== seg) : [...values, seg]
                                        );
                                    }}
                                >
                                    <span>{seg}</span>
                                    {active && <CheckCircle2 className="h-4 w-4 text-cyan-300" />}
                                </Button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}

function TemplateDropdown({ onSelectTemplate }: { onSelectTemplate: (htmlOrText: string) => void }) {
    const templates = [
        { name: "Announcement – Minimal", content: "Hello,\n\nWe’re excited to share an update...\n\n— Team" },
        { name: "Promo – Bold (HTML)", content: "<h1>Big Savings</h1><p>Use code <strong>SAVE20</strong> at checkout.</p>" },
        { name: "Newsletter – Clean", content: "Subject: Monthly Roundup\n\n- Highlight 1\n- Highlight 2\n\nThanks for reading!" },
    ];
    const [open, setOpen] = useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Wand2 className="h-4 w-4 mr-1.5" />
                    Templates
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
                <div className="text-sm font-medium mb-2">Insert template</div>
                <div className="space-y-1">
                    {templates.map((t) => (
                        <Button
                            key={t.name}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                                onSelectTemplate(t.content);
                                setOpen(false);
                            }}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            {t.name}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

function EmailPreview({
    device,
    subject,
    preheader,
    content,
}: {
    device: "desktop" | "mobile";
    subject: string;
    preheader: string;
    content: string;
}) {
    return (
        <div
            className={cn(
                "mx-auto rounded-xl border border-slate-800/60 bg-slate-950/60 backdrop-blur p-5 text-sm",
                device === "mobile" ? "max-w-105" : "max-w-4xl"
            )}
        >
            <div className="mb-4">
                <div className="text-slate-200 font-medium">{subject || "Subject preview"}</div>
                <div className="text-slate-400 text-xs">{preheader || "Preheader preview"}</div>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
                {content ? (
                    <RenderContent content={content} />
                ) : (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2 bg-slate-800" />
                        <Skeleton className="h-4 w-2/3 bg-slate-800" />
                        <Skeleton className="h-4 w-1/3 bg-slate-800" />
                    </div>
                )}
            </div>
        </div>
    );
}

function RenderContent({ content }: { content: string }) {
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);
    if (isHtml) {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return (
        <pre className="whitespace-pre-wrap text-slate-200 font-sans leading-relaxed">
            {content}
        </pre>
    );
}

function PreviewSheet({
    subject,
    preheader,
    content,
}: {
    subject: string;
    preheader: string;
    content: string;
}) {
    const [open, setOpen] = useState(false);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Fullscreen preview
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-180 sm:w-215">
                <SheetHeader>
                    <SheetTitle>Email Preview</SheetTitle>
                    <SheetDescription>Rendered subject & body.</SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                    <EmailPreview device="desktop" subject={subject} preheader={preheader} content={content} />
                </div>
            </SheetContent>
        </Sheet>
    );
}

/* ------------------------------ BACKGROUND FX ------------------------------ */

function AuroraBackground() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute bottom-10 left-1/4 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>
    );
}
