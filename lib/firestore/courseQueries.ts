import { Course } from '@/types/course';
import {
    collection,
    DocumentData,
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
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchCourses = useCallback(async () => {
        if (!user?.email) return;
        setFetchingCourses(true);
        try {
            const q = query(
                courseRef,
                where('createdBy', '!=', user.email),
                orderBy('createdOn', 'desc'),
                limit(7),
            );

            const snapshot = await getDocs(q);

            const freshData = snapshot.docs.map((doc) => ({
                ...(doc.data() as Course),
                id: doc.id,
            }));

            // 🔁 Compare with cache
            const cached = getCoursesFromCache();

            if (!cached || areCoursesDifferent(cached, freshData)) {
                setCourses(freshData);
                saveCoursesToCache(freshData);
            }

            setLastDoc(snapshot.docs.at(-1) ?? null);
            if (snapshot.docs.length < 7) setHasMore(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load courses.');
        } finally {
            setFetchingCourses(false);
        }
    }, [user?.email, courseRef]);

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
    };
};
