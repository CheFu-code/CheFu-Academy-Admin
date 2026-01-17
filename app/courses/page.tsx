'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { getCourses } from '@/lib/getCourses';
import { Course } from '@/types/course';
import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoadingCourses(true);
                const data = await getCourses();
                setCourses(data);
            } catch (error) {
                console.log(`Error fetching courses, ${error}`);
                alert(`${error}`);
            } finally {
                setLoadingCourses(false);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Courses</h1>

            {loadingCourses ? (
                <Loader className="animate-spin size-4" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {courses.length > 0 ? (
                        courses.map((c) => (
                            <Card
                                key={c.id}
                                className="hover:shadow-lg transition-shadow duration-200 rounded-2xl"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold truncate">
                                        {c.courseTitle}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {c.description ||
                                            'No description available.'}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))
                    ) : (
                        <div>
                            <p className="text-center text-gray-500">
                                No courses found.
                            </p>
                            <Button
                                onClick={() =>
                                    router.push('/courses/create-course')
                                }
                                className="mt-8 cursor-pointer"
                            >
                                Create course
                                <Plus />
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
