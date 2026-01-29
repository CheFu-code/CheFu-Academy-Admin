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
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { auth, db } from '../firebase';

export const CoursesQuery = () => {
    const courseRef = collection(db, 'course');
    const [user, setUser] = useState(auth.currentUser);
    const [courses, setCourses] = useState<Course[]>([]);
    const [fetchingCourses, setFetchingCourses] = useState(true);
    const [fetchingCourseById, setFetchingCourseById] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(u => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    const fetchCourses = useCallback(async () => {
        if (!user?.email) {
            setCourses([]);
            return;
        }

        setFetchingCourses(true);

        try {
            // Fetch initial batch, slightly larger in case we filter some
            const q = query(
                courseRef,
                orderBy('createdOn', 'desc'),
                limit(10)
            );

            const snapshot = await getDocs(q);

            // Map docs and filter out courses created by the user
            const allCourses = snapshot.docs
                .map((doc) => ({ ...(doc.data() as Course), id: doc.id }))
                .filter((course) => course.createdBy !== user.email);

            // Fetch user's enrolled courses
            const enrolledQ = query(
                courseRef,
                where('createdBy', '==', user.email),
                where('originalCourseId', '!=', null)
            );
            const enrolledSnap = await getDocs(enrolledQ);

            const enrolledOriginalIds = enrolledSnap.docs.map((doc) => {
                const data = doc.data() as Course;
                return data.originalCourseId ?? doc.id;
            });

            // Filter out courses the user is already enrolled in
            const freshData = allCourses.filter(
                (course) => !enrolledOriginalIds.includes(course.id)
            );

            setCourses(freshData);
            setLastDoc(snapshot.docs.at(-1) ?? null);

            // Determine if there might be more courses to fetch
            setHasMore(snapshot.docs.length >= 10 && freshData.length > 0);

        } catch (error) {
            toast.error('Failed to load courses.');
            alert(`Error fetching courses: ${error}`);
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

        if (!lastDoc) {
            return;
        }
        if (loadingMore) {
            return;
        }
        if (!hasMore) {
            return;
        }
        if (!user?.email) {
            return;
        }

        setLoadingMore(true);

        try {
            const q = query(
                courseRef,
                orderBy('createdOn', 'desc'),
                startAfter(lastDoc),
                limit(10) // fetch a few extra in case some are yours
            );

            const snapshot = await getDocs(q);

            const data = snapshot.docs
                .map((doc) => ({ ...(doc.data() as Course), id: doc.id }))
                .filter((course) => course.createdBy !== user.email);


            setCourses((prev) => {
                const updated = [...prev, ...data];
                return updated;
            });

            setLastDoc(snapshot.docs.at(-1) ?? null);

            if (snapshot.docs.length < 10 || data.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching more courses:', error);
            toast.error('Failed to load more courses.');
        } finally {
            setLoadingMore(false);
            console.log('LoadingMore set to false');
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

            const data = snap.data() as Omit<Course, 'id'>;
            return { id: snap.id, ...data };
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
        hasMore,
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
