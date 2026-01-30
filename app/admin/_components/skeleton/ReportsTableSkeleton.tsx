import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

// Helper: Create a small rounded bar skeleton
const Bar = ({ className = '' }: { className?: string }) => (
    <Skeleton className={`h-3 rounded-md ${className}`} />
);

export const ReportsTableSkeleton = ({ rows = 6 }: { rows?: number }) => {
    // Keep column widths consistent with actual content:
    // ID | Title | Reported At | Reported By | Reason | Actions
    return (
        <div className="overflow-x-auto" aria-busy="true" aria-live="polite">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <div className="flex items-center gap-2">
                                <Bar className="w-10" />
                            </div>
                        </TableHead>
                        <TableHead>
                            <Bar className="w-24 sm:w-36 md:w-48" />
                        </TableHead>
                        <TableHead>
                            <Bar className="w-24 sm:w-28" />
                        </TableHead>
                        <TableHead>
                            <Bar className="w-24 sm:w-32" />
                        </TableHead>
                        <TableHead>
                            <Bar className="w-20 sm:w-40" />
                        </TableHead>
                        <TableHead>
                            <Bar className="w-16" />
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <TableRow key={i} className="hover:bg-transparent">
                            {/* ID */}
                            <TableCell>
                                <Bar className="w-16" />
                            </TableCell>

                            {/* Title */}
                            <TableCell>
                                <div className="flex flex-col gap-2">
                                    <Bar className="w-40 sm:w-56 md:w-72" />
                                    <Bar className="w-24 sm:w-40 md:w-52 opacity-70" />
                                </div>
                            </TableCell>

                            {/* Reported At */}
                            <TableCell>
                                <Bar className="w-28" />
                            </TableCell>

                            {/* Reported By */}
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                    <Bar className="w-24 sm:w-36" />
                                </div>
                            </TableCell>

                            {/* Reason */}
                            <TableCell>
                                <div className="flex flex-col gap-2">
                                    <Bar className="w-56 sm:w-72 md:w-96" />
                                    <Bar className="w-40 sm:w-60 md:w-80 opacity-70" />
                                </div>
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-16 rounded-md" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
