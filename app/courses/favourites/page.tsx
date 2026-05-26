'use client';

import CourseCard from '@/components/Shared/CourseCard';
import Header from '@/components/Shared/Header';
import GridCourseCardSkeleton from '@/components/skeletons/GridCourseCardSkeleton';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { Course } from '@/types/course';
import {
    collection,
    documentId,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import { BookOpen, Heart, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuthUser } from '@/hooks/useAuthUser';

const FAVORITES_CHUNK_SIZE = 10;

const chunkIds = (ids: string[]) => {
    const chunks: string[][] = [];

    for (let index = 0; index < ids.length; index += FAVORITES_CHUNK_SIZE) {
        chunks.push(ids.slice(index, index + FAVORITES_CHUNK_SIZE));
    }

    return chunks;
};

const toCourse = (id: string, data: Record<string, unknown>): Course => ({
    id,
    docId: String(data.docId || id),
    banner_image: String(data.banner_image || '/tech-coding.jpg'),
    category: String(data.category || ''),
    chapters: Array.isArray(data.chapters) ? data.chapters : [],
    courseTitle: String(data.courseTitle || 'Untitled course'),
    createdBy: String(data.createdBy || ''),
    createdOn: data.createdOn as Course['createdOn'],
    description: String(data.description || ''),
    enrolled: Boolean(data.enrolled),
    flashcards: Array.isArray(data.flashcards) ? data.flashcards : [],
    qa: Array.isArray(data.qa) ? data.qa : [],
    quiz: Array.isArray(data.quiz) ? data.quiz : [],
    completedChapter: Array.isArray(data.completedChapter)
        ? data.completedChapter
        : [],
    originalCourseId:
        typeof data.originalCourseId === 'string'
            ? data.originalCourseId
            : undefined,
    lastStudiedAt: data.lastStudiedAt as Course['lastStudiedAt'],
    lastStudiedChapterIndex:
        typeof data.lastStudiedChapterIndex === 'number'
            ? data.lastStudiedChapterIndex
            : undefined,
    lastStudiedContentIndex:
        typeof data.lastStudiedContentIndex === 'number'
            ? data.lastStudiedContentIndex
            : undefined,
    lastStudiedChapterName:
        typeof data.lastStudiedChapterName === 'string'
            ? data.lastStudiedChapterName
            : undefined,
    lastStudiedTopic:
        typeof data.lastStudiedTopic === 'string'
            ? data.lastStudiedTopic
            : undefined,
    averageRating: Number(data.averageRating || 0),
    reviewCount: Number(data.reviewCount || 0),
    completedChapterEvents: Array.isArray(data.completedChapterEvents)
        ? data.completedChapterEvents
        : [],
});

export default function FavouriteCoursesPage() {
    const { user, loading: authLoading } = useAuthUser();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const favoriteIds = useMemo(
        () =>
            Array.isArray(user?.favoriteCourseIds)
                ? user.favoriteCourseIds.map(String).filter(Boolean)
                : [],
        [user?.favoriteCourseIds],
    );

    useEffect(() => {
        let cancelled = false;

        const fetchFavouriteCourses = async () => {
            if (authLoading) return;

            if (!favoriteIds.length) {
                setCourses([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const snapshots = await Promise.all(
                    chunkIds(favoriteIds).map((ids) =>
                        getDocs(
                            query(
                                collection(db, 'course'),
                                where(documentId(), 'in', ids),
                            ),
                        ),
                    ),
                );
                const nextCourses = snapshots
                    .flatMap((snapshot) =>
                        snapshot.docs.map((docSnap) =>
                            toCourse(docSnap.id, docSnap.data()),
                        ),
                    )
                    .sort(
                        (a, b) =>
                            favoriteIds.indexOf(a.originalCourseId || a.id) -
                            favoriteIds.indexOf(b.originalCourseId || b.id),
                    );

                if (!cancelled) setCourses(nextCourses);
            } catch (error) {
                console.error('Failed to fetch favourite courses:', error);
                if (!cancelled) setCourses([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void fetchFavouriteCourses();

        return () => {
            cancelled = true;
        };
    }, [authLoading, favoriteIds]);

    if (authLoading || loading) return <GridCourseCardSkeleton />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <Header
                    header="Favourite Courses"
                    description="Saved courses you want to return to later"
                />

                <Button asChild variant="outline">
                    <Link href="/courses/search">
                        <Search className="size-4" />
                        Find courses
                    </Link>
                </Button>
            </div>

            {courses.length > 0 ? (
                <>
                    <div className="inline-flex items-center gap-2 rounded-lg border bg-card/60 px-3 py-2 text-sm text-muted-foreground">
                        <Heart className="size-4 fill-rose-500 text-rose-500" />
                        {courses.length} saved course
                        {courses.length !== 1 ? 's' : ''}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                bannerImage={course.banner_image}
                                title={course.courseTitle}
                                description={course.description}
                                chaptersCount={course.chapters?.length || 0}
                                category={course.category}
                                qualityLabel={`${(course.averageRating || 0).toFixed(1)} stars`}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <section className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border bg-card p-8 text-center shadow-sm">
                    <div className="flex size-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
                        <Heart className="size-7" />
                    </div>
                    <h2 className="mt-5 text-xl font-semibold">
                        No favourite courses yet
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Use the heart button on a course page to save it here
                        for quicker access.
                    </p>
                    <Button asChild className="mt-5">
                        <Link href="/courses">
                            <BookOpen className="size-4" />
                            Browse courses
                        </Link>
                    </Button>
                </section>
            )}
        </div>
    );
}
