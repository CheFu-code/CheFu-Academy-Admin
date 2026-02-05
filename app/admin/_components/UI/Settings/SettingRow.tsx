import { Label } from '@/components/ui/label';
import { JSX } from 'react';

export const SettingRow = ({
    id,
    label,
    desc,
    children,
}: {
    id: string;
    label: string;
    desc: string;
    children: JSX.Element;
}) => (
    <div className="mb-6">
        <Label htmlFor={id} className="dark:text-gray-300 text-sm font-medium">
            {label}
        </Label>
        <p id={`${id}-desc`} className="text-gray-500 text-xs mb-2">
            {desc}
        </p>
        {children}
    </div>
);
