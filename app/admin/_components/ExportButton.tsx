'use client';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { FaFileExport } from 'react-icons/fa';

interface ExportButtonProps {
    handleExportCSV: () => void;
    handleExportPDF: () => void;
}

export default function ExportButton({
    handleExportCSV,
    handleExportPDF,
}: ExportButtonProps) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <FaFileExport className="h-4 w-4" /> Export All
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="bg-white border rounded-md shadow-md p-1 w-40">
                <DropdownMenu.Item
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onSelect={handleExportCSV}
                >
                    Download CSV
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onSelect={handleExportPDF}
                >
                    Download PDF
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
