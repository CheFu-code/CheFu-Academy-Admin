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
    };
}

export async function fetchCoursesServer(limitCount = 24): Promise<Course[]> {
    const snapshot = await getFirebaseAdminDb()
        .collection('course')
        .orderBy('createdOn', 'desc')
        .limit(limitCount)
        .get();

    return snapshot.docs.map(doc => toCourse(doc.id, doc.data()));
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

    if (!normalized) {
        return courses;
    }

    return courses.filter(
        course =>
            course.category?.toLowerCase().includes(normalized) ||
            course.courseTitle?.toLowerCase().includes(normalized),
    );
}
