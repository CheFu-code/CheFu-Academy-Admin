'use client';

import Header from '@/components/Shared/Header';
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
    DocumentData,
    getDocs,
    limit,
    orderBy,
    query,
    QueryDocumentSnapshot,
    where,
} from 'firebase/firestore';
import { Loader, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CoursesPage() {
    const user = auth.currentUser;
    const router = useRouter();
    const courseRef = collection(db, 'course');
    const [courses, setCourses] = useState<Course[]>([]);
    const [fetchingCourses, setFetchingCourses] = useState(false);

    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);

    const fetchCourses = useCallback(async () => {
        setFetchingCourses(true);

        if (!user?.email) {
            setFetchingCourses(false);
            return;
        }

        try {
            const q = query(
                courseRef,
                where('createdBy', '!=', user.email),
                orderBy('createdOn', 'desc'),
                limit(7),
            );

            const snapshot = await getDocs(q);

            const data = snapshot.docs.map((doc) => ({
                ...(doc.data() as Course),
                id: doc.id,
            }));

            setCourses(data);
            setLastDoc(snapshot.docs.at(-1) ?? null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load courses.');
        } finally {
            setFetchingCourses(false);
        }
    }, [user?.email, courseRef]);

    useEffect(() => {
        if (user?.email) {
            fetchCourses();
        }
    }, [user?.email]);

    return (
        <div className="min-h-screen px-4">
            <Header
                header="Courses"
                description="Explore our wide range of courses and start learning today."
            />

            {fetchingCourses ? (
                <Loader className="animate-spin items-center justify-center size-4" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {courses.length > 0 ? (
                        courses.map((c) => (
                            <div
                                key={c.id}
                                className="hover:shadow-lg hover:bg-gray-100/10  transition-shadow duration-200 rounded-xl cursor-pointer border border-muted-foreground"
                            >
                                <div className="relative w-full h-40 overflow-hidden rounded-t-2xl">
                                    <Image
                                        alt="Banner"
                                        src={c.banner_image}
                                        priority
                                        fill
                                        className="object-fit"
                                        sizes="w-full h-40"
                                    />
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-lg mt-4 font-semibold truncate">
                                        {c.courseTitle}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {c.description ||
                                            'No description available.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-semibold mb-2 mt-2">
                                        {c.chapters.length > 1
                                            ? `${c.chapters.length} Chapters`
                                            : `${c.chapters.length} Chapter`}
                                    </p>
                                </CardContent>
                            </div>
                        ))
                    ) : (
                        <div className="justify-start text-start">
                            <p className="text-start mt-10 text-gray-500">
                                No courses found.
                            </p>
                            <Button
                                onClick={() =>
                                    router.push('/courses/create-course')
                                }
                                className="mt-20 items-center cursor-pointer"
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
