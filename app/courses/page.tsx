'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { auth, db } from '@/lib/firebase';
import { Course } from '@/types/course';
import {
    collection,
    getDocFromCache,
    limit,
    orderBy,
    query,
    where,
} from 'firebase/firestore';
import { Loader, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export default function CoursesPage() {
    const user = auth.currentUser;
    const router = useRouter();
    const courseRef = collection(db, 'course');
    const [courses, setCourses] = useState<Course[]>([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [fetchingCourses, setFetchingCourses] = useState(false);

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             setLoadingCourses(true);
    //             const data = await getCourses();
    //             setCourses(data);
    //             console.log('data:', data);
    //         } catch (error) {
    //             console.log(`Error fetching courses, ${error}`);
    //             alert(`${error}`);
    //         } finally {
    //             setLoadingCourses(false);
    //         }
    //     })();
    // }, []);

    const fetchCourses = useCallback(async () => {
        if (fetchingCourses) return;
        setFetchingCourses(true);
        setLastDoc(null);

        if (!user?.email) {
            setFetchingCourses(false);
            return;
        }

        try {
            const q = query(
                courseRef,
                where('createdBy', '!=', user?.email),
                orderBy('createdOn', 'desc'),
                limit(7),
            );

            const snapshot = await getDocFromCache(q);

            const data = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            setCourses(data);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load your progress');
        } finally {
            setFetchingCourses(false);
        }
    }, [user?.email, fetchingCourses, courseRef]);

    return (
        <div className="min-h-screen px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-start">Courses</h1>

            {fetchingCourses ? (
                <Loader className="animate-spin size-4" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {courses.length > 0 ? (
                        courses.map((c) => (
                            <Card
                                key={c.id}
                                className="hover:shadow-lg transition-shadow duration-200 rounded-2xl"
                            >
                                <div className="relative w-full h-40 overflow-hidden rounded-t-2xl">
                                    <Image
                                        alt="Banner"
                                        src={c.banner_image}
                                        fill
                                        className="object-fit"
                                    />
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold truncate">
                                        {c.courseTitle}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {c.description ||
                                            'No description available.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {c.chapters.length} Chapters
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div>
                            <p className="text-end w-full text-gray-500">
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
