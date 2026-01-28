import { Course } from '@/types/course';
import {
    collection,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryDocumentSnapshot,
    startAfter,
    where,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { auth, db } from '../firebase';
import {
    areCoursesDifferent,
    getCoursesFromCache,
    saveCoursesToCache,
} from '@/helpers/courseCache';
import { toast } from 'sonner';

export const CoursesQuery = () => {
    const user = auth.currentUser;
    const courseRef = collection(db, 'course');
    const [courses, setCourses] = useState<Course[]>([]);
    const [fetchingCourses, setFetchingCourses] = useState(false);
    const [fetchingCourseById, setFetchingCourseById] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchCourses = useCallback(async () => {
        if (!user?.email) return;
        setFetchingCourses(true);

        try {
            // 1️⃣ Get all courses not created by this user
            const q = query(
                courseRef,
                where('createdBy', '!=', user.email),
                orderBy('createdOn', 'desc'),
                limit(7)
            );

            const snapshot = await getDocs(q);

            const allCourses = snapshot.docs.map((doc) => ({
                ...(doc.data() as Course),
                id: doc.id,
            }));

            // 2️⃣ Get all originalCourseId's the user has already enrolled in
            const enrolledQ = query(
                courseRef,
                where('createdBy', '==', user.email),
                where('originalCourseId', '!=', null)
            );

            const enrolledSnap = await getDocs(enrolledQ);
            const enrolledOriginalIds = enrolledSnap.docs.map(
                (doc) => (doc.data() as Course).originalCourseId
            );

            // 3️⃣ Filter out courses the user already enrolled in
            const freshData = allCourses.filter(
                (course) => !enrolledOriginalIds.includes(course.id)
            );

            // 🔁 Compare with cache
            const cached = getCoursesFromCache();

            if (!cached || areCoursesDifferent(cached, freshData)) {
                setCourses(freshData);
                saveCoursesToCache(freshData);
            }

            setLastDoc(snapshot.docs.at(-1) ?? null);
            if (snapshot.docs.length < 7) setHasMore(false);
        } catch (error) {
            console.error('Failed to load courses:', error);
            toast.error('Failed to load courses.');
        } finally {
            setFetchingCourses(false);
        }
    }, [user?.email, courseRef]);

    const fetchSearchedCourses = async (): Promise<Course[]> => {
        const q = query(
            collection(db, 'course'),
            orderBy('createdOn', 'desc'),
        );

        const snap = await getDocs(q);
        return snap.docs.map((doc) => ({
            ...(doc.data() as Omit<Course, 'id'>),
            id: doc.id,
        }));
    };

    const fetchMoreCourses = useCallback(async () => {
        if (!lastDoc || loadingMore || !hasMore || !user?.email) return;
        setLoadingMore(true);

        try {
            const q = query(
                courseRef,
                where('createdBy', '!=', user.email),
                orderBy('createdOn', 'desc'),
                startAfter(lastDoc),
                limit(7),
            );

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((doc) => ({
                ...(doc.data() as Course),
                id: doc.id,
            }));

            setCourses((prev) => {
                const updated = [...prev, ...data];
                saveCoursesToCache(updated);
                return updated;
            });
            setLastDoc(snapshot.docs.at(-1) ?? null);
            if (snapshot.docs.length < 7) setHasMore(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load more courses.');
        } finally {
            setLoadingMore(false);
        }
    }, [lastDoc, loadingMore, hasMore, courseRef, user?.email]);

    const fetchCourseById = useCallback(async (id: string): Promise<Course | null> => {
        if (!user?.email || !id) return null;

        setFetchingCourseById(true);
        try {
            const docRef = doc(db, 'course', id); // direct reference by document ID
            const snap = await getDoc(docRef);

            if (!snap.exists()) {
                console.warn('Course not found');
                return null;
            }

            const { id: _, ...data } = snap.data() as Course;
            return { id: snap.id, ...data }; // single Course
        } catch (error) {
            console.error('Error fetching course:', error);
            return null;
        } finally {
            setFetchingCourseById(false);
        }
    }, [user?.email]);


    return {
        user,
        fetchCourses,
        fetchMoreCourses,
        courses,
        setCourses,
        setHasMore,
        fetchingCourses,
        setFetchingCourses,
        loadingMore,
        fetchCourseById,
        fetchingCourseById,
        setFetchingCourseById,
        fetchSearchedCourses
    };
};
