'use client';

import Header from '@/components/Shared/Header';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Course } from '@/types/course';
import HomeCourseCard from '../HomeCourseCard';
import { ArrowDownAZ, Clock3, PlusSquare, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type SortOption =
    | 'last-opened'
    | 'newest'
    | 'progress'
    | 'completed'
    | 'title'
    | 'category';

type TimestampLike = {
    seconds?: number;
    toDate?: () => Date;
};

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'last-opened', label: 'Last opened' },
    { value: 'newest', label: 'Newest created' },
    { value: 'progress', label: 'Most progress' },
    { value: 'completed', label: 'Completed first' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'category', label: 'Category A-Z' },
];

const toMillis = (value: unknown) => {
    if (!value) return 0;
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = Date.parse(value);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    const timestamp = value as TimestampLike;
    if (typeof timestamp.toDate === 'function') {
        return timestamp.toDate().getTime();
    }
    if (typeof timestamp.seconds === 'number') {
        return timestamp.seconds * 1000;
    }

    return 0;
};

const getProgress = (course: Course) => {
    const completedChapters = course.completedChapter?.length || 0;
    const totalChapters = course.chapters.length;

    return totalChapters > 0 ? completedChapters / totalChapters : 0;
};

const MyCourseUI = ({ courses }: { courses: Course[] }) => {
    const router = useRouter();
    const [sortBy, setSortBy] = useState<SortOption>('last-opened');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const categories = useMemo(
        () =>
            Array.from(
                new Set(
                    courses
                        .map((course) => course.category?.trim())
                        .filter(Boolean),
                ),
            ).sort((a, b) => a.localeCompare(b)),
        [courses],
    );

    const visibleCourses = useMemo(() => {
        const filtered =
            categoryFilter === 'all'
                ? courses
                : courses.filter((course) => course.category === categoryFilter);

        return [...filtered].sort((a, b) => {
            if (sortBy === 'last-opened') {
                return toMillis(b.lastStudiedAt) - toMillis(a.lastStudiedAt);
            }

            if (sortBy === 'newest') {
                return toMillis(b.createdOn) - toMillis(a.createdOn);
            }

            if (sortBy === 'progress') {
                return getProgress(b) - getProgress(a);
            }

            if (sortBy === 'completed') {
                return Number(getProgress(b) === 1) - Number(getProgress(a) === 1);
            }

            if (sortBy === 'category') {
                return (a.category || '').localeCompare(b.category || '');
            }

            return (a.courseTitle || '').localeCompare(b.courseTitle || '');
        });
    }, [categoryFilter, courses, sortBy]);

    return (
        <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <Header
                    header="My Courses"
                    description="Your active learning journey"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card/60 p-2">
                        <div className="flex items-center gap-2 px-1 text-sm font-medium text-muted-foreground">
                            <SlidersHorizontal className="size-4" />
                            Sort
                        </div>
                        <Select
                            value={sortBy}
                            onValueChange={(value) => setSortBy(value as SortOption)}
                        >
                            <SelectTrigger className="w-[170px] bg-background">
                                <SelectValue placeholder="Sort courses" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-[170px] bg-background">
                                <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={() => router.push('/courses/create-course')}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        <PlusSquare className="size-5" />
                        New course
                    </Button>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                    <Clock3 className="size-4" />
                    {visibleCourses.length} course
                    {visibleCourses.length !== 1 ? 's' : ''}
                </span>
                <span className="inline-flex items-center gap-1">
                    <ArrowDownAZ className="size-4" />
                    {sortOptions.find((option) => option.value === sortBy)?.label}
                </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleCourses.map((course) => {
                    const completedChapters =
                        course?.completedChapter?.length || 0;
                    const totalChapters = course.chapters.length;
                    const progress =
                        totalChapters > 0
                            ? (completedChapters / totalChapters) * 100
                            : 0;

                    return (
                        <HomeCourseCard
                            key={course.id}
                            id={course.id}
                            banner_image={course.banner_image}
                            courseTitle={course.courseTitle}
                            category={course.category}
                            totalChapters={totalChapters}
                            completedChapters={completedChapters}
                            progress={progress}
                        />
                    );
                })}
            </div>
        </>
    );
};

export default MyCourseUI;
