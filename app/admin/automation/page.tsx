import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Wrench,
    GitCompare,
    ListTree,
    Cpu,
    Bug,
    ServerCog,
    Activity,
    Settings2,
    Database,
    Clock,
    Terminal,
    FileSearch,
    Workflow,
} from 'lucide-react';
import Header from '@/components/Shared/Header';

const AutomationAndTools = () => {
    return (
        <div className=" flex flex-col gap-10 w-full">
            <Header
                header="Admin Automation & Tools"
                description="Access automation pipelines, diagnostic utilities, developer
                    tools, and system operations."
            />

            {/* ================== TOP UTILITY GRID (New Style) ================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <UtilityItem
                    icon={<ListTree className="h-6 w-6 text-purple-400" />}
                    label="Automation Pipelines"
                    desc="Manage automated workflows & triggers."
                />

                <UtilityItem
                    icon={<Cpu className="h-6 w-6 text-blue-400" />}
                    label="System Diagnostics"
                    desc="Check system performance & process health."
                />

                <UtilityItem
                    icon={<Bug className="h-6 w-6 text-red-400" />}
                    label="Error Inspector"
                    desc="View logs, failures, crash reports."
                />

                <UtilityItem
                    icon={<ServerCog className="h-6 w-6 text-green-400" />}
                    label="Worker Queue"
                    desc="Monitor jobs, retries & worker status."
                />
            </div>

            {/* ================== AUTOMATION PIPELINES ================== */}
            <Section
                title="Automation Pipelines"
                icon={<Workflow className="h-5 w-5 text-yellow-400" />}
            >
                <AutomationList />
            </Section>

            {/* ================== SYSTEM UTILITIES ================== */}
            <Section
                title="System Tools"
                icon={<Wrench className="h-5 w-5 text-cyan-400" />}
            >
                <SystemTools />
            </Section>

            {/* ================== DEVELOPER TOOLS ================== */}
            <Section
                title="Developer Tools"
                icon={<Terminal className="h-5 w-5 text-orange-400" />}
            >
                <DeveloperTools />
            </Section>
        </div>
    );
};

export default AutomationAndTools;

/* -----------------------------------------------------------------
   COMPONENTS
------------------------------------------------------------------ */

const UtilityItem = ({
    icon,
    label,
    desc,
}: {
    icon: React.ReactNode;
    label: string;
    desc: string;
}) => (
    <Card className="p-4 rounded-xl transition">
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <p className="font-medium">{label}</p>
        </div>
        <p className="text-gray-400 text-sm">{desc}</p>
    </Card>
);

const Section = ({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) => (
    <Card className=" p-6 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
            {icon}
            <h2 className="text-xl  font-semibold">{title}</h2>
        </div>
        <Separator className="bg-[#2A2F36] mb-4" />
        {children}
    </Card>
);

/* ---------------- AUTOMATION LIST ------------------- */

const AutomationList = () => {
    const items = [
        { name: 'Cleanup stale sessions', status: 'Scheduled' },
        { name: 'Sync video metadata', status: 'Active' },
        { name: 'Process course certificates', status: 'Active' },
        { name: 'Send weekly reports', status: 'Paused' },
    ];

    return (
        <div className="flex flex-col gap-4">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="p-4 dark:bg-[#0F1217] bg-primary-foreground rounded-lg flex justify-between items-center"
                >
                    <div>
                        <p className=" font-medium">{item.name}</p>
                        <p className="text-gray-500 text-xs mt-1">
                            Status: {item.status}
                        </p>
                    </div>

                    <Button variant="secondary" className="cursor-pointer">
                        Manage
                    </Button>
                </div>
            ))}
        </div>
    );
};

/* ---------------- SYSTEM TOOLS ------------------- */

const SystemTools = () => {
    const tools = [
        {
            icon: <Activity className="h-5 w-5 text-blue-400" />,
            name: 'Health Monitor',
        },
        {
            icon: <FileSearch className="h-5 w-5 text-purple-400" />,
            name: 'Log Explorer',
        },
        {
            icon: <Clock className="h-5 w-5 text-yellow-400" />,
            name: 'Cron Jobs',
        },
        {
            icon: <ServerCog className="h-5 w-5 text-green-400" />,
            name: 'Worker Queue',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tools.map((tool, i) => (
                <div
                    key={i}
                    className="p-4 dark:bg-[#0F1217] bg-primary-foreground rounded-lg flex items-center gap-3"
                >
                    {tool.icon}
                    <p>{tool.name}</p>
                </div>
            ))}
        </div>
    );
};

/* ---------------- DEVELOPER TOOLS ------------------- */

const DeveloperTools = () => {
    const devTools = [
        {
            icon: <Terminal className="h-5 w-5 text-orange-400" />,
            name: 'API Console',
        },
        {
            icon: <Settings2 className="h-5 w-5 text-cyan-400" />,
            name: 'Config Inspector',
        },
        {
            icon: <Database className="h-5 w-5 text-green-400" />,
            name: 'Database Explorer',
        },
        {
            icon: <GitCompare className="h-5 w-5 text-pink-400" />,
            name: 'Webhook Tester',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {devTools.map((t, i) => (
                <div
                    key={i}
                    className="p-4 bg-primary-foreground dark:bg-[#0F1217]  rounded-lg flex items-center gap-3"
                >
                    {t.icon}
                    <p>{t.name}</p>
                </div>
            ))}
        </div>
    );
};
