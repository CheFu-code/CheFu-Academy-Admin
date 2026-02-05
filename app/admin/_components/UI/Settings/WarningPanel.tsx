import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export const WarningPanel = () => (
    <Card className="bg-red-500/20  p-5 rounded-xl">
        <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-500 font-medium">
                Warning: 2 failed backup attempts detected in the last 24 hours.
            </p>
        </div>
    </Card>
);
