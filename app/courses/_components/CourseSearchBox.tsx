'use client';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock3, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'chefu-course-search-history';

type SearchHistoryItem = {
    query: string;
    count: number;
    lastSearchedAt: number;
};

function readHistory(): SearchHistoryItem[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export default function CourseSearchBox({
    initialValue = '',
    placeholder = 'Search courses by name, category...',
    className = '',
    suggestions = [],
}: {
    initialValue?: string;
    placeholder?: string;
    className?: string;
    suggestions?: string[];
}) {
    const router = useRouter();
    const [search, setSearch] = useState(initialValue);
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);

    useEffect(() => {
        setHistory(readHistory());
    }, []);

    const visibleSuggestions = useMemo(() => {
        const normalized = search.trim().toLowerCase();
        const recent = [...history]
            .sort((a, b) => b.lastSearchedAt - a.lastSearchedAt)
            .map(item => item.query);
        const combined = Array.from(new Set([...recent, ...suggestions]));

        return combined
            .filter(item => {
                if (!item) return false;
                if (!normalized) return true;
                return item.toLowerCase().includes(normalized);
            })
            .slice(0, 6);
    }, [history, search, suggestions]);

    const submitSearch = (value = search) => {
        const query = value.trim();
        if (!query) return;
        router.push(`/courses/search?query=${encodeURIComponent(query)}`);
    };

    return (
        <div className={`mt-1 space-y-2 ${className}`}>
            <div className="relative">
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
                        onClick={() => submitSearch()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Go to search"
                    >
                        <Search className="h-4 w-4 cursor-pointer" />
                    </button>
                )}
            </div>

            {visibleSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {visibleSuggestions.map(item => (
                        <Badge
                            key={item}
                            variant="outline"
                            className="cursor-pointer bg-background"
                            onClick={() => submitSearch(item)}
                        >
                            {history.some(historyItem => historyItem.query === item) && (
                                <Clock3 className="h-3 w-3" />
                            )}
                            {item}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
