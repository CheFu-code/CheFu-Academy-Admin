'use client';

import CourseCard from '@/components/Shared/CourseCard';
import { Badge } from '@/components/ui/badge';
import { Clock3, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export type SearchableCourse = {
    id: string;
    title: string;
    description: string;
    category: string;
    bannerImage: string;
    chaptersCount: number;
};

type SearchHistoryItem = {
    query: string;
    count: number;
    lastSearchedAt: number;
};

const STORAGE_KEY = 'chefu-course-search-history';

function normalize(value: string) {
    return value.trim().toLowerCase();
}

function tokenize(value: string) {
    return normalize(value)
        .split(/[^a-z0-9]+/i)
        .filter(token => token.length > 2);
}

function readHistory(): SearchHistoryItem[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeHistory(history: SearchHistoryItem[]) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            history
                .sort((a, b) => b.lastSearchedAt - a.lastSearchedAt)
                .slice(0, 24),
        ),
    );
}

export default function SearchPersonalization({
    currentQuery,
    courses,
    resultIds,
}: {
    currentQuery: string;
    courses: SearchableCourse[];
    resultIds: string[];
}) {
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);

    useEffect(() => {
        const query = currentQuery.trim();
        const currentHistory = readHistory();

        if (!query) {
            setHistory(currentHistory);
            return;
        }

        const normalized = normalize(query);
        const existing = currentHistory.find(
            item => normalize(item.query) === normalized,
        );
        const nextHistory = existing
            ? currentHistory.map(item =>
                  normalize(item.query) === normalized
                      ? {
                            ...item,
                            query,
                            count: item.count + 1,
                            lastSearchedAt: Date.now(),
                        }
                      : item,
              )
            : [
                  {
                      query,
                      count: 1,
                      lastSearchedAt: Date.now(),
                  },
                  ...currentHistory,
              ];

        writeHistory(nextHistory);
        setHistory(nextHistory);
    }, [currentQuery]);

    const frequentSearches = useMemo(
        () =>
            [...history]
                .sort(
                    (a, b) =>
                        b.count - a.count || b.lastSearchedAt - a.lastSearchedAt,
                )
                .slice(0, 6),
        [history],
    );

    const personalizedCourses = useMemo(() => {
        const resultSet = new Set(resultIds);
        const weightedTerms = new Map<string, number>();

        history.forEach(item => {
            tokenize(item.query).forEach(token => {
                weightedTerms.set(
                    token,
                    (weightedTerms.get(token) || 0) + item.count,
                );
            });
        });

        if (!weightedTerms.size) return [];

        return courses
            .filter(course => !resultSet.has(course.id))
            .map(course => {
                const haystack = normalize(
                    `${course.title} ${course.description} ${course.category}`,
                );
                let score = 0;

                weightedTerms.forEach((weight, token) => {
                    if (haystack.includes(token)) score += weight;
                    if (normalize(course.category).includes(token)) {
                        score += weight * 2;
                    }
                });

                return { course, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(item => item.course);
    }, [courses, history, resultIds]);

    if (!history.length) return null;

    return (
        <section className="mt-8 space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Sparkles className="h-4 w-4" />
                        Personalized discovery
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Based on your searches
                    </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    {frequentSearches.map(item => (
                        <Badge
                            key={item.query}
                            asChild
                            variant="outline"
                            className="bg-background"
                        >
                            <Link
                                href={`/courses/search?query=${encodeURIComponent(item.query)}`}
                            >
                                <Clock3 className="h-3 w-3" />
                                {item.query}
                            </Link>
                        </Badge>
                    ))}
                </div>
            </div>

            {personalizedCourses.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {personalizedCourses.map(course => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            bannerImage={course.bannerImage}
                            title={course.title}
                            description={course.description}
                            chaptersCount={course.chaptersCount}
                        />
                    ))}
                </div>
            )}

            {!personalizedCourses.length && (
                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                    <TrendingUp className="mr-2 inline h-4 w-4 text-primary" />
                    Keep searching topics you care about and CheFu will surface
                    better course matches here.
                </div>
            )}
        </section>
    );
}
