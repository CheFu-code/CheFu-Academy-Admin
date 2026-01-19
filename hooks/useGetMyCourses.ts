import { db } from '@/lib/firebase';
import { Course } from '@/types/course';
import { User as FirebaseUser } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';

export const useGetMyCourse = () => {
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

            setCourses(fetchedCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    return { courses, loading, setLoading, fetchCourses };
};
