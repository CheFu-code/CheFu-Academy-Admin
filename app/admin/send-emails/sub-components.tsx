'use client'

import * as React from "react";
import { useMemo, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Eye, FileText, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function TemplateDropdown({ onSelectTemplate }: { onSelectTemplate: (htmlOrText: string) => void }) {
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

export function EmailPreview({
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
    const sanitizedContent = useMemo(
        () => DOMPurify.sanitize(content),
        [content]
    );

    if (isHtml) {
        return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
    }
    return (
        <pre className="whitespace-pre-wrap text-slate-200 font-sans leading-relaxed">
            {content}
        </pre>
    );
}

export function PreviewSheet({
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

