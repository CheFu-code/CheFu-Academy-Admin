import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconSearch } from '@tabler/icons-react';
import React from 'react';
import { FaFileExport } from 'react-icons/fa';

const HeaderAndSearch = ({
    searchTerm,
    setSearchTerm,
    handleExportPDF,
}: {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    handleExportPDF: () => void;
}) => {
    return (
        <div>
            <div className="flex flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Reports</h1>
                <Button
                    onClick={handleExportPDF}
                    variant="default"
                    size="sm"
                    className="cursor-pointer hover:bg-primary/80"
                >
                    {' '}
                    <FaFileExport className="items-center h-4 w-4" /> Export
                    All{' '}
                </Button>
            </div>

            {/* Search */}
            <div className="mb-6 w-full md:w-1/2 relative">
                <Input
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search reports..."
                    className="pr-10"
                />
                {searchTerm && (
                    <button className="cursor-pointer absolute right-0 top-0 h-full px-3 flex items-center justify-center">
                        <IconSearch className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default HeaderAndSearch;
