import Header from '@/components/Shared/Header';
import { buttonVariants } from '@/components/ui/button';
import { fetchCoursesServer } from '@/services/serverCourseService';
import type { Metadata } from 'next';
import Link from 'next/link';
import CourseGrid from './_components/CourseGrid';
import CourseSearchBox from './_components/CourseSearchBox';
import { PlusSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
    return {
        title: 'Courses | CheFu Academy',
        description:
            'Explore CheFu Academy courses and start learning something new today.',
    };
}

export default async function CoursesPage() {
    const courses = await fetchCoursesServer();

    return (
        <div className="min-h-screen px-4">
            <div className="flex justify-between items-center">
                <Header
                    header="Courses"
                    description="Learn something new today."
                />
                <Link
                    href="/courses/create-course"
                    className={buttonVariants({
                        variant: 'ghost',
                        className: 'p-2',
                    })}
                    aria-label="Create course"
                >
                    <PlusSquare className="size-5" />
                </Link>
            </div>

            <CourseSearchBox />
            <CourseGrid courses={courses} />
        </div>
    );
}
