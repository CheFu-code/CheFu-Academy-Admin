import CourseCard from '@/components/Shared/CourseCard';
import { Badge } from '@/components/ui/badge';
import { fetchCoursesServer, searchCoursesServer } from '@/services/serverCourseService';
import type { Course } from '@/types/course';
import type { Metadata } from 'next';
import Link from 'next/link';
import CourseSearchBox from '../_components/CourseSearchBox';
import SearchFilters from '../_components/SearchFilters';
import SearchPersonalization, {
    SearchableCourse,
} from '../_components/SearchPersonalization';
import { BookOpen, Compass, Search, Sparkles, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

type SearchPageProps = {
    searchParams: Promise<{
        query?: string;
        category?: string;
        depth?: string;
        sort?: string;
    }>;
};

function normalize(value: string) {
    return value.trim().toLowerCase();
}

function tokenize(value: string) {
    return normalize(value)
        .split(/[^a-z0-9]+/i)
        .filter(token => token.length > 2);
}

function scoreCourse(course: Course, query: string) {
    const tokens = tokenize(query);
    if (!tokens.length) return 0;

    const title = normalize(course.courseTitle);
    const category = normalize(course.category);
    const description = normalize(course.description);

    return tokens.reduce((score, token) => {
        if (title.includes(token)) score += 5;
        if (category.includes(token)) score += 4;
        if (description.includes(token)) score += 2;
        return score;
    }, 0);
}

function courseQualityScore(course: Course) {
    let score = 0;
    if (course.chapters?.length) score += Math.min(course.chapters.length, 8);
    if (course.quiz?.length) score += 2;
    if (course.flashcards?.length) score += 2;
    if (course.qa?.length) score += 2;
    if (course.description && course.description.length > 80) score += 1;
    return score;
}

function getQualityLabel(course: Course) {
    const score = courseQualityScore(course);
    if (score >= 10) return 'Rich course';
    if (score >= 6) return 'Well built';
    return 'Quick path';
}

function timestampToMillis(value: unknown) {
    if (
        value &&
        typeof value === 'object' &&
        'toMillis' in value &&
        typeof value.toMillis === 'function'
    ) {
        return value.toMillis();
    }

    if (
        value &&
        typeof value === 'object' &&
        'seconds' in value &&
        typeof value.seconds === 'number'
    ) {
        return value.seconds * 1000;
    }

    return 0;
}

function toSearchableCourse(course: Course): SearchableCourse {
    return {
        id: course.id,
        title: course.courseTitle,
        description: course.description || '',
        category: course.category || '',
        bannerImage: course.banner_image,
        chaptersCount: course.chapters?.length || 0,
    };
}

function getTopCategories(courses: Course[]) {
    const counts = new Map<string, number>();

    courses.forEach(course => {
        if (!course.category) return;
        counts.set(course.category, (counts.get(course.category) || 0) + 1);
    });

    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 8)
        .map(([category]) => category);
}

function filterCourses(
    courses: Course[],
    {
        category,
        depth,
    }: {
        category: string;
        depth: string;
    },
) {
    return courses.filter(course => {
        if (category && course.category !== category) return false;

        const chapterCount = course.chapters?.length || 0;
        if (depth === 'short') return chapterCount >= 1 && chapterCount <= 4;
        if (depth === 'medium') return chapterCount >= 5 && chapterCount <= 8;
        if (depth === 'deep') return chapterCount >= 9;

        return true;
    });
}

function sortCourses(courses: Course[], sort: string, query: string) {
    return [...courses].sort((a, b) => {
        if (sort === 'quality') {
            return courseQualityScore(b) - courseQualityScore(a);
        }
        if (sort === 'newest') {
            return timestampToMillis(b.createdOn) - timestampToMillis(a.createdOn);
        }
        if (sort === 'chapters') {
            return (b.chapters?.length || 0) - (a.chapters?.length || 0);
        }
        if (sort === 'title') {
            return (a.courseTitle || '').localeCompare(b.courseTitle || '');
        }

        return scoreCourse(b, query) - scoreCourse(a, query);
    });
}

function getRelatedCourses({
    courses,
    results,
    query,
}: {
    courses: Course[];
    results: Course[];
    query: string;
}) {
    const resultIds = new Set(results.map(course => course.id));
    const resultCategories = new Set(
        results.map(course => normalize(course.category)).filter(Boolean),
    );

    return courses
        .filter(course => !resultIds.has(course.id))
        .map(course => {
            const queryScore = scoreCourse(course, query);
            const categoryScore = resultCategories.has(normalize(course.category))
                ? 3
                : 0;

            return {
                course,
                score: queryScore + categoryScore,
            };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(item => item.course);
}

export async function generateMetadata({
    searchParams,
}: SearchPageProps): Promise<Metadata> {
    const { query = '' } = await searchParams;

    return {
        title: query
            ? `Search "${query}" | CheFu Academy Courses`
            : 'Course Search | CheFu Academy',
        description: query
            ? `Find CheFu Academy courses related to ${query}.`
            : 'Search CheFu Academy courses by title, topic, or category.',
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const {
        query = '',
        category = '',
        depth = '',
        sort = 'relevance',
    } = await searchParams;
    const trimmedQuery = query.trim();
    const [results, allCourses] = await Promise.all([
        searchCoursesServer(trimmedQuery),
        fetchCoursesServer(120),
    ]);

    const filteredResults = sortCourses(
        filterCourses(results, { category, depth }),
        sort,
        trimmedQuery,
    );

    const relatedCourses = getRelatedCourses({
        courses: allCourses,
        results: filteredResults,
        query: trimmedQuery,
    });
    const topCategories = getTopCategories(allCourses);
    const allCategories = Array.from(
        new Set(allCourses.map(course => course.category).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b));
    const resultIds = filteredResults.map(course => course.id);
    const searchableCourses = allCourses.map(toSearchableCourse);
    const hasQuery = Boolean(trimmedQuery);

    return (
        <main className="min-h-screen space-y-8 px-4 pb-10">
            <section className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-primary text-primary-foreground">
                                <Search className="h-3.5 w-3.5" />
                                Course search
                            </Badge>
                            {hasQuery && (
                                <Badge variant="outline">
                                    {filteredResults.length} result
                                    {filteredResults.length !== 1 ? 's' : ''}
                                </Badge>
                            )}
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                {hasQuery
                                    ? `Results for "${trimmedQuery}"`
                                    : 'Find your next course'}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                Search by topic, skill, category, or outcome.
                                CheFu also learns from your recent searches to
                                surface more useful course recommendations over
                                time.
                            </p>
                        </div>

                        <CourseSearchBox
                            initialValue={trimmedQuery}
                            placeholder="Try data science, public speaking, Python, design..."
                            className="max-w-2xl"
                            suggestions={topCategories}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                        <SearchStat
                            icon={BookOpen}
                            label="Courses"
                            value={allCourses.length}
                        />
                        <SearchStat
                            icon={Sparkles}
                            label="Matched"
                            value={filteredResults.length}
                        />
                        <SearchStat
                            icon={Compass}
                            label="Related"
                            value={relatedCourses.length}
                        />
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Popular directions
                        </p>
                        <h2 className="text-xl font-bold tracking-tight">
                            Explore by category
                        </h2>
                    </div>
                    <SearchFilters
                        categories={allCategories}
                        selectedCategory={category}
                        selectedDepth={depth}
                        selectedSort={sort}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {topCategories.map(category => (
                        <Badge
                            key={category}
                            asChild
                            variant={
                                normalize(category) === normalize(trimmedQuery)
                                    ? 'default'
                                    : 'outline'
                            }
                            className="bg-background"
                        >
                            <Link
                                href={`/courses/search?query=${encodeURIComponent(category)}`}
                            >
                                {category}
                            </Link>
                        </Badge>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Best matches
                        </p>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {hasQuery ? 'Search results' : 'Recommended courses'}
                        </h2>
                    </div>
                    {hasQuery && (
                        <p className="text-sm text-muted-foreground">
                            Ranked by title, category, and description match.
                        </p>
                    )}
                </div>

                {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredResults.map(course => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                bannerImage={course.banner_image}
                                title={course.courseTitle}
                                description={course.description}
                                chaptersCount={course.chapters?.length || 0}
                                category={course.category}
                                qualityLabel={getQualityLabel(course)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border bg-muted/30 p-8 text-center">
                        <TrendingUp className="mx-auto h-8 w-8 text-primary" />
                        <h3 className="mt-3 text-lg font-semibold">
                            No exact matches yet
                        </h3>
                        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                            Try a broader phrase, search by category, or use one
                            of the related suggestions below.
                        </p>
                    </div>
                )}
            </section>

            {relatedCourses.length > 0 && (
                <section className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Similar paths
                        </p>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Related courses
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {relatedCourses.map(course => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                bannerImage={course.banner_image}
                                title={course.courseTitle}
                                description={course.description}
                                chaptersCount={course.chapters?.length || 0}
                                category={course.category}
                                qualityLabel={getQualityLabel(course)}
                            />
                        ))}
                    </div>
                </section>
            )}

            <SearchPersonalization
                currentQuery={trimmedQuery}
                courses={searchableCourses}
                resultIds={resultIds}
            />
        </main>
    );
}

function SearchStat({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-lg border bg-background p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
    );
}
