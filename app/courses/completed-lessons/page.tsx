'use client';

import CompletedLessonsUI from '@/components/Courses/UI/CompletedLessonsUI';
import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import { Course } from '@/types/course';
import { User as FirebaseUser, getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CompletedLessons() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthUser();
    const router = useRouter();

    const fetchCourses = async (user: FirebaseUser) => {
        try {
            const q = query(
                collection(db, 'course'),
                where('createdBy', '==', user.email),
            );
            const snapshot = await getDocs(q);

            const fetchedCourses: Course[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    docId: doc.id,
                    banner_image: data.banner_image || '',
                    category: data.category || '',
                    chapters: data.chapters || [],
                    courseTitle: data.courseTitle || '',
                    createdBy: data.createdBy || '',
                    createdOn: data.createdOn,
                    description: data.description || '',
                    enrolled: data.enrolled || false,
                    flashcards: data.flashcards || [],
                    qa: data.qa || [],
                    quiz: data.quiz || [],
                    completedChapter: data.completedChapter || [],
                };
            });

            // ✅ filter only completed ones
            const completedOnly = fetchedCourses.filter(
                (c) =>
                    c.chapters.length > 0 &&
                    c.completedChapter?.length === c.chapters.length,
            );

            setCourses(completedOnly);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || loading) return;
        if (courses?.[0]?.createdBy !== user.email) {
            toast.error('You are not authorized to view this course!');
            router.replace('/courses');
        }
    }, [courses, user, router, loading]);

    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged((user) => {
            if (user) fetchCourses(user);
            else setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading)
        return (
            <div className="flex items-center justify-center h-full p-4">
                <p className="font-bold animate-pulse text-base sm:text-lg">
                    Loading your completed courses...
                </p>
            </div>
        );

    if (courses.length === 0)
        return (
            <div className="flex items-center justify-center h-full p-4">
                <p className="font-bold text-base sm:text-lg">
                    You haven&apos;t completed any course yet.
                </p>
            </div>
        );

    return <CompletedLessonsUI courses={courses} router={router} />;
}
