import { useDropzone } from "react-dropzone";
import { Eye, FlaskConical, Link2, Send, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TemplateDropdown } from "./sub-components";
import type { CampaignType, EmailFormState, SetFormField } from "./types";

type ComposeTabProps = {
    type: CampaignType;
    form: EmailFormState;
    setField: SetFormField;
    files: File[];
    removeFile: (name: string) => void;
    handleSendTest: () => Promise<void>;
    dropzone: Pick<ReturnType<typeof useDropzone>, "getRootProps" | "getInputProps" | "isDragActive">;
};

export function ComposeTab({
    type,
    form,
    setField,
    files,
    removeFile,
    handleSendTest,
    dropzone,
}: ComposeTabProps) {
    const { getRootProps, getInputProps, isDragActive } = dropzone;

    return (
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
                                    placeholder="Write or paste your HTML/text content here..."
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
                                        placeholder="Variant B content..."
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
                                                ? "Drop files to attach..."
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
    );
}
