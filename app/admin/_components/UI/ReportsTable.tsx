import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Report } from '@/types/reports';
import { ReportsTableSkeleton } from '../skeleton/ReportsTableSkeleton';

const ReportsTable = ({
    reports,
    loading,
}: {
    reports: Report[];
    loading: boolean;
}) => {
    const renderContent = () => {
        if (loading) {
            return <ReportsTableSkeleton rows={4} />; // configurable rows
        }

        if (reports.length === 0) {
            return (
                <div className="p-6 text-center text-muted-foreground">
                    No reports found
                </div>
            );
        }

        return (
            <div className="overflow-x-auto scrollbar-none">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold">ID</TableHead>
                            <TableHead className="font-semibold">
                                Title
                            </TableHead>
                            <TableHead className="font-semibold">
                                Reported At
                            </TableHead>
                            <TableHead className="font-semibold">
                                Reported By
                            </TableHead>
                            <TableHead className="font-semibold">
                                Reason
                            </TableHead>
                            <TableHead className="font-semibold">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {reports.map((report) => {
                            const shortId =
                                report.id.length > 12
                                    ? `${report.id.slice(0, 12)}...`
                                    : report.id;

                            return (
                                <TableRow
                                    key={report.id}
                                    className="hover:bg-muted/40 transition-colors scrollbar-none"
                                >
                                    <TableCell title={report.id}>
                                        {shortId}
                                    </TableCell>
                                    <TableCell>{report.title}</TableCell>
                                    <TableCell>{report.reportedAt}</TableCell>
                                    <TableCell>{report.reportedBy}</TableCell>
                                    <TableCell className="truncate max-w-xs">
                                        {report.reason}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer"
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Reports</CardTitle>
            </CardHeader>

            <CardContent className="p-0">{renderContent()}</CardContent>
        </Card>
    );
};

export default ReportsTable;
