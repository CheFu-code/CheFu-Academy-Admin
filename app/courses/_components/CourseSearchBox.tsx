'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CourseSearchBox({
    initialValue = '',
    placeholder = 'Search courses by name, category...',
    className = '',
}: {
    initialValue?: string;
    placeholder?: string;
    className?: string;
}) {
    const router = useRouter();
    const [search, setSearch] = useState(initialValue);

    const submitSearch = () => {
        const query = search.trim();
        if (!query) return;
        router.push(`/courses/search?query=${encodeURIComponent(query)}`);
    };

    return (
        <div className={`relative mt-1 ${className}`}>
            <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') submitSearch();
                }}
                placeholder={placeholder}
                aria-label="Search courses"
            />

            {search && (
                <button
                    type="button"
                    onClick={submitSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                    aria-label="Go to search"
                >
                    <Search className="h-4 w-4 cursor-pointer" />
                </button>
            )}
        </div>
    );
}
