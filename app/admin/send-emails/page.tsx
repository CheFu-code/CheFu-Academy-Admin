'use client'

import * as React from "react";
import { MainPanel } from "./main-panel";
import { AuroraBackground, HeaderBar, SidebarNav } from "./send-emails-layout";

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
