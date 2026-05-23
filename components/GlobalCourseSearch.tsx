'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type SearchHistoryItem = {
    query: string;
    count: number;
    lastSearchedAt: number;
};

const STORAGE_KEY = 'chefu-course-search-history';
const fallbackSuggestions = [
    'Web Development',
    'Python',
    'Data Science',
    'Business',
    'Design',
];

function readHistory(): SearchHistoryItem[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export default function GlobalCourseSearch() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);

    useEffect(() => {
        setHistory(readHistory());

        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen(true);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const suggestions = useMemo(() => {
        const recent = [...history]
            .sort((a, b) => b.lastSearchedAt - a.lastSearchedAt)
            .map(item => item.query);

        return Array.from(new Set([...recent, ...fallbackSuggestions])).slice(0, 5);
    }, [history]);

    const submit = (value = query) => {
        const trimmed = value.trim();
        if (!trimmed) {
            router.push('/courses/search');
            setOpen(false);
            return;
        }

        router.push(`/courses/search?query=${encodeURIComponent(trimmed)}`);
        setOpen(false);
        setQuery('');
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
    };

    return (
        <>
            <form
                onSubmit={onSubmit}
                className="hidden min-w-0 flex-1 md:block md:max-w-xl"
            >
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search courses from anywhere..."
                        className="h-9 pl-9 pr-20"
                    />
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground lg:block"
                    >
                        Ctrl K
                    </button>
                </div>
            </form>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setOpen(true)}
                aria-label="Search courses"
            >
                <Search className="size-4" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Search courses</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                autoFocus
                                value={query}
                                onChange={event => setQuery(event.target.value)}
                                placeholder="Try Python, design, business..."
                                className="pl-9"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map(item => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => submit(item)}
                                    className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        <Button type="submit" className="w-full">
                            Search Courses
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
