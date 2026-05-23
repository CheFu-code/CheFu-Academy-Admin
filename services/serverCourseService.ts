import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { Course } from '@/types/course';

function toCourse(id: string, data: FirebaseFirestore.DocumentData): Course {
    return {
        id,
        banner_image: data.banner_image || '/tech-coding.jpg',
        category: data.category || '',
        chapters: Array.isArray(data.chapters) ? data.chapters : [],
        courseTitle: data.courseTitle || 'Untitled course',
        createdBy: data.createdBy || '',
        createdOn: data.createdOn,
        description: data.description || '',
        docId: data.docId || id,
        enrolled: Boolean(data.enrolled),
        flashcards: Array.isArray(data.flashcards) ? data.flashcards : [],
        qa: Array.isArray(data.qa) ? data.qa : [],
        quiz: Array.isArray(data.quiz) ? data.quiz : [],
        completedChapter: Array.isArray(data.completedChapter)
            ? data.completedChapter
            : [],
        originalCourseId: data.originalCourseId,
        lastStudiedAt: data.lastStudiedAt,
        lastStudiedChapterIndex: Number.isFinite(data.lastStudiedChapterIndex)
            ? data.lastStudiedChapterIndex
            : undefined,
        lastStudiedContentIndex: Number.isFinite(data.lastStudiedContentIndex)
            ? data.lastStudiedContentIndex
            : undefined,
        lastStudiedChapterName: data.lastStudiedChapterName,
        lastStudiedTopic: data.lastStudiedTopic,
    };
}

function isCanonicalCourse(course: Course) {
    return !course.enrolled && !course.originalCourseId;
}

export async function fetchCoursesServer(limitCount = 24): Promise<Course[]> {
    const snapshot = await getFirebaseAdminDb()
        .collection('course')
        .orderBy('createdOn', 'desc')
        .limit(limitCount * 3)
        .get();

    return snapshot.docs
        .map(doc => toCourse(doc.id, doc.data()))
        .filter(isCanonicalCourse)
        .slice(0, limitCount);
}

export async function countCoursesServer(): Promise<number> {
    const snapshot = await getFirebaseAdminDb()
        .collection('course')
        .count()
        .get();

    return snapshot.data().count;
}

export async function searchCoursesServer(queryText: string): Promise<Course[]> {
    const normalized = queryText.trim().toLowerCase();
    const courses = await fetchCoursesServer(100);

    if (!normalized) return courses;

    return courses.filter(
        course =>
            course.category?.toLowerCase().includes(normalized) ||
            course.courseTitle?.toLowerCase().includes(normalized),
    );
}

function timestampToMillis(value: unknown) {
    if (
        value &&
        typeof value === 'object' &&
        'toMillis' in value &&
        typeof value.toMillis === 'function'
    ) {
        return value.toMillis();
    }

    return 0;
}

export async function fetchSmartResumeCourseServer(
    email?: string,
): Promise<Course | null> {
    if (!email) return null;

    const snapshot = await getFirebaseAdminDb()
        .collection('course')
        .where('createdBy', '==', email)
        .limit(50)
        .get();

    const courses = snapshot.docs
        .map(doc => toCourse(doc.id, doc.data()))
        .filter(course => course.lastStudiedAt);

    courses.sort(
        (a, b) =>
            timestampToMillis(b.lastStudiedAt) -
            timestampToMillis(a.lastStudiedAt),
    );

    return courses[0] || null;
}
