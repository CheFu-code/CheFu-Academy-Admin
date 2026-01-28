'use client';

import CompletedLessonsUI from '@/components/Courses/UI/CompletedLessonsUI';
import Header from '@/components/Shared/Header';
import GridCourseCardSkeleton from '@/components/skeletons/GridCourseCardSkeleton';
import { db } from '@/lib/firebase';
import { Course } from '@/types/course';
import { User as FirebaseUser, getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CompletedLessons() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

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
        const unsubscribe = getAuth().onAuthStateChanged((user) => {
            if (user) fetchCourses(user);
            else setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <GridCourseCardSkeleton />;

    if (courses.length === 0)
        return (
            <>
                <Header
                    header="Completed Courses"
                    description="Your completed courses"
                />
                <div className="flex items-center justify-center h-full">
                    <p className="font-bold text-base sm:text-lg">
                        You haven&apos;t completed any course yet.
                    </p>
                </div>
            </>
        );

    return <CompletedLessonsUI courses={courses} />;
}
