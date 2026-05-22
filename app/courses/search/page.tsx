import Header from '@/components/Shared/Header';
import { searchCoursesServer } from '@/services/serverCourseService';
import type { Metadata } from 'next';
import CourseGrid from '../_components/CourseGrid';

export const dynamic = 'force-dynamic';

type SearchPageProps = {
    searchParams: Promise<{ query?: string }>;
};

export async function generateMetadata({
    searchParams,
}: SearchPageProps): Promise<Metadata> {
    const { query = '' } = await searchParams;

    return {
        title: query
            ? `Search "${query}" | CheFu Academy Courses`
            : 'Course Search | CheFu Academy',
        description: 'Search CheFu Academy courses by title or category.',
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { query = '' } = await searchParams;
    const courses = await searchCoursesServer(query);

    return (
        <div className="min-h-screen bg-background">
            <div className="flex justify-between items-center">
                <Header
                    header="Search results"
                    description={`Search results for "${query}"`}
                />
                <span className="text-muted-foreground">
                    {courses.length} result{courses.length !== 1 ? 's' : ''}
                </span>
            </div>

            <CourseGrid courses={courses} />
        </div>
    );
}
