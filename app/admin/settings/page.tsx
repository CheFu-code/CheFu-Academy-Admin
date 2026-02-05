import Header from '@/components/Shared/Header';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    AlertTriangle,
    Cloud,
    Cpu,
    HardDrive,
    Network,
    Shield,
    Terminal,
} from 'lucide-react';
import { JSX } from 'react';

const SystemSettings = () => {
    return (
        <div className=" w-full flex flex-col gap-8">
            {/* PAGE TITLE */}
            <Header
                header="System Control Center"
                description="Administrative access to core system configurations,
                    infrastructure, and backend rules."
            />

            {/* TOP SYSTEM STATUS GRID (NEW STYLE) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatusBlock
                    icon={<Cpu className="h-6 w-6 text-cyan-400" />}
                    title="Server Load"
                    value="32%"
                />

                <StatusBlock
                    icon={<Network className="h-6 w-6 text-purple-400" />}
                    title="API Uptime (30d)"
                    value="99.98%"
                />

                <StatusBlock
                    icon={<HardDrive className="h-6 w-6 text-yellow-400" />}
                    title="Storage Usage"
                    value="68%"
                />

                <StatusBlock
                    icon={<Cloud className="h-6 w-6 text-green-400" />}
                    title="Backup Status"
                    value="Healthy"
                />
            </div>

            {/* SYSTEM WARNINGS */}
            <WarningPanel />

            {/* SYSTEM SECTIONS – ACCORDION BASED CONFIG PANELS */}
            <Card className=" p-6 rounded-xl">
                <Accordion type="multiple" className="w-full">
                    {/* ===== SYSTEM ENGINE ===== */}
                    <AccordionItem value="engine">
                        <AccordionTrigger className=" flex items-center gap-2">
                            <Terminal className="h-4 w-4 text-blue-400" />
                            System Engine
                        </AccordionTrigger>
                        <AccordionContent>
                            <SettingRow
                                label="Background Workers"
                                desc="Enable task processors for email, media, and queues."
                            >
                                <Switch />
                            </SettingRow>

                            <SettingRow
                                label="Task Concurrency"
                                desc="Maximum number of worker threads."
                            >
                                <Input placeholder="4" />
                            </SettingRow>
                        </AccordionContent>
                    </AccordionItem>

                    {/* ===== SECURITY ===== */}
                    <AccordionItem value="security">
                        <AccordionTrigger className=" flex items-center gap-2">
                            <Shield className="h-4 w-4 text-green-400" />
                            Security Enforcement
                        </AccordionTrigger>
                        <AccordionContent>
                            <SettingRow
                                label="Admin 2FA Required"
                                desc="All admins must verify with two-factor authentication."
                            >
                                <Switch />
                            </SettingRow>

                            <SettingRow
                                label="IP Access Control"
                                desc="Restrict access to specific IP ranges."
                            >
                                <Input
                                    placeholder="192.168.1.0/24"
                                    className=""
                                />
                            </SettingRow>
                        </AccordionContent>
                    </AccordionItem>

                    {/* ===== NETWORK ===== */}
                    <AccordionItem value="network">
                        <AccordionTrigger className=" flex items-center gap-2">
                            <Network className="h-4 w-4 text-purple-400" />
                            Network & API
                        </AccordionTrigger>
                        <AccordionContent>
                            <SettingRow
                                label="Rate Limiting"
                                desc="Requests per minute allowed for authenticated users."
                            >
                                <Input placeholder="900" className="" />
                            </SettingRow>

                            <SettingRow
                                label="Public API Enabled"
                                desc="Allow external integrations to use your API."
                            >
                                <Switch />
                            </SettingRow>
                        </AccordionContent>
                    </AccordionItem>

                    {/* ===== BACKUP ===== */}
                    <AccordionItem value="backup">
                        <AccordionTrigger className=" flex items-center gap-2">
                            <Cloud className="h-4 w-4 text-yellow-400" />
                            Backup & Recovery
                        </AccordionTrigger>
                        <AccordionContent>
                            <SettingRow
                                label="Auto Backup Schedule"
                                desc="Frequency of system backups."
                            >
                                <Input
                                    placeholder="Daily at 02:00 AM"
                                    className=""
                                />
                            </SettingRow>

                            <SettingRow
                                label="Remote Backup Endpoint"
                                desc="External backup storage location."
                            >
                                <Input
                                    placeholder="s3://bucket-name/backups"
                                    className=""
                                />
                            </SettingRow>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
        </div>
    );
};

export default SystemSettings;

/* ---------------------------------------
   COMPONENTS (NEW SYSTEM CONTROL STYLE)
---------------------------------------- */

const StatusBlock = ({
    icon,
    title,
    value,
}: {
    icon: JSX.Element;
    title: string;
    value: string;
}) => (
    <Card className=" p-5 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <p className="dark:text-gray-400 text-sm">{title}</p>
        </div>
        <p className="text-2xl font-bold">{value}</p>
    </Card>
);

const WarningPanel = () => (
    <Card className="bg-red-500/20  p-5 rounded-xl">
        <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-500 font-medium">
                Warning: 2 failed backup attempts detected in the last 24 hours.
            </p>
        </div>
    </Card>
);

const SettingRow = ({
    label,
    desc,
    children,
}: {
    label: string;
    desc: string;
    children: JSX.Element;
}) => (
    <div className="mb-6">
        <Label className="dark:text-gray-300 text-sm font-medium">
            {label}
        </Label>
        <p className="text-gray-500 text-xs mb-2">{desc}</p>
        {children}
    </div>
);
