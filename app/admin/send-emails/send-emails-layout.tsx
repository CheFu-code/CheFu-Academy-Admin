'use client'

import { Sparkles, Settings, FolderUp, Wand2, Mail, Users, FileText, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function HeaderBar() {
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

export function SidebarNav() {
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

export function AuroraBackground() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute bottom-10 left-1/4 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>
    );
}
