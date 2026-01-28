'use client';

import CourseCard from '@/components/Shared/CourseCard';
import Header from '@/components/Shared/Header';
import { CoursesQuery } from '@/lib/firestore/courseQueries';
import { Course } from '@/types/course';
import { Loader } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SearchCourseContent = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const { fetchSearchedCourses } = CoursesQuery();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFilteredCourses = async () => {
            setLoading(true);
            try {
                const allCourses = await fetchSearchedCourses();
                const filtered = allCourses.filter(
                    (c) =>
                        c.category
                            ?.toLowerCase()
                            .includes(query.toLowerCase()) ||
                        c.courseTitle
                            ?.toLowerCase()
                            .includes(query.toLowerCase()),
                );

                setCourses(filtered);
                console.log('Filtered courses:', filtered);
            } catch (err) {
                console.error('Failed to fetch courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredCourses();
    }, [query]);
    return (
        <div>
            <Header
                header="Search results"
                description={`Search results for "${query}"`}
            />

            {!loading && courses.length === 0 && (
                <p className="flex justify-center items-center h-full">
                    No results found
                </p>
            )}

            {loading ? (
                <Loader className="animate-spin" />
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            bannerImage={course.banner_image}
                            title={course.courseTitle}
                            description={course.description}
                            chaptersCount={course.chapters?.length || 0}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchCourseContent;
