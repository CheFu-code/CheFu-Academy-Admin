import { Card } from '@/components/ui/card';
import { JSX } from 'react';

export const StatusBlock = ({
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
