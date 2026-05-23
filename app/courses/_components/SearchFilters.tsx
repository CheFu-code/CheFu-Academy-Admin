'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchFilters({
    categories,
    selectedCategory,
    selectedDepth,
    selectedSort,
}: {
    categories: string[];
    selectedCategory: string;
    selectedDepth: string;
    selectedSort: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value || value === 'all' || value === 'relevance') {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        router.push(`/courses/search?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card/70 p-2">
            <div className="flex items-center gap-2 px-1 text-sm font-medium text-muted-foreground">
                <SlidersHorizontal className="size-4" />
                Filters
            </div>

            <Select
                value={selectedCategory || 'all'}
                onValueChange={value => updateParam('category', value)}
            >
                <SelectTrigger className="w-[170px] bg-background">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map(category => (
                        <SelectItem key={category} value={category}>
                            {category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={selectedDepth || 'all'}
                onValueChange={value => updateParam('depth', value)}
            >
                <SelectTrigger className="w-[150px] bg-background">
                    <SelectValue placeholder="Depth" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Any length</SelectItem>
                    <SelectItem value="short">Short: 1-4 chapters</SelectItem>
                    <SelectItem value="medium">Medium: 5-8 chapters</SelectItem>
                    <SelectItem value="deep">Deep: 9+ chapters</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={selectedSort || 'relevance'}
                onValueChange={value => updateParam('sort', value)}
            >
                <SelectTrigger className="w-[160px] bg-background">
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="relevance">Best match</SelectItem>
                    <SelectItem value="quality">Course quality</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="chapters">Most chapters</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
