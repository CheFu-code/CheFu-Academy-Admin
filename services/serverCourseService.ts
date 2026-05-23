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
        averageRating: Number(data.averageRating) || 0,
        reviewCount: Number(data.reviewCount) || 0,
        completedChapterEvents: Array.isArray(data.completedChapterEvents)
            ? data.completedChapterEvents
            : [],
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

    return courses
        .map(course => ({
            course,
            score: scoreCourseForSearch(course, normalized),
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.course);
}

function normalizeSearch(value: string) {
    return value.trim().toLowerCase();
}

function tokenizeSearch(value: string) {
    return normalizeSearch(value)
        .split(/[^a-z0-9]+/i)
        .filter(token => token.length > 1);
}

function hasNearMatch(text: string, token: string) {
    if (text.includes(token)) return true;
    if (token.length < 4) return false;

    return text
        .split(/[^a-z0-9]+/i)
        .some(word => word.length > 2 && levenshtein(word, token) <= 1);
}

function courseQualityScore(course: Course) {
    let score = 0;
    if (course.chapters.length) score += Math.min(course.chapters.length, 8);
    if (course.quiz.length) score += 2;
    if (course.flashcards.length) score += 2;
    if (course.qa.length) score += 2;
    if (course.description && course.description.length > 80) score += 1;
    if (course.averageRating) score += course.averageRating * 1.5;
    if (course.reviewCount) score += Math.min(course.reviewCount, 20) * 0.1;
    return score;
}

function scoreCourseForSearch(course: Course, normalizedQuery: string) {
    const tokens = tokenizeSearch(normalizedQuery);
    if (!tokens.length) return 0;

    const title = normalizeSearch(course.courseTitle);
    const category = normalizeSearch(course.category);
    const description = normalizeSearch(course.description);
    const titleWords = title.split(/[^a-z0-9]+/i);
    let score = 0;

    if (title === normalizedQuery) score += 20;
    if (category === normalizedQuery) score += 14;

    tokens.forEach(token => {
        if (title.includes(token)) score += 8;
        if (category.includes(token)) score += 7;
        if (description.includes(token)) score += 3;
        if (titleWords.some(word => word.startsWith(token))) score += 3;
        if (hasNearMatch(title, token)) score += 2;
        if (hasNearMatch(category, token)) score += 2;
    });

    return score + courseQualityScore(course) * 0.35;
}

function levenshtein(a: string, b: string) {
    const dp = Array.from({ length: a.length + 1 }, (_, index) => [index]);

    for (let j = 1; j <= b.length; j += 1) dp[0][j] = j;

    for (let i = 1; i <= a.length; i += 1) {
        for (let j = 1; j <= b.length; j += 1) {
            dp[i][j] =
                a[i - 1] === b[j - 1]
                    ? dp[i - 1][j - 1]
                    : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        }
    }

    return dp[a.length][b.length];
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

export async function fetchMyCoursesServer(email?: string): Promise<Course[]> {
    if (!email) return [];

    const snapshot = await getFirebaseAdminDb()
        .collection('course')
        .where('createdBy', '==', email)
        .limit(80)
        .get();

    return snapshot.docs.map(doc => toCourse(doc.id, doc.data()));
}

export async function fetchRecommendedCoursesForUserServer(
    email?: string,
    limitCount = 6,
): Promise<{ focusCategory: string; courses: Course[] }> {
    const [myCourses, allCourses] = await Promise.all([
        fetchMyCoursesServer(email),
        fetchCoursesServer(120),
    ]);
    const focusCategory = getFocusCategory(myCourses);
    const ownedIds = new Set(myCourses.map(course => course.originalCourseId || course.id));

    const recommendations = allCourses
        .filter(course => !ownedIds.has(course.id))
        .map(course => ({
            course,
            score:
                (course.category === focusCategory ? 12 : 0) +
                courseQualityScore(course) +
                (course.averageRating || 0) * 2 +
                Math.min(course.reviewCount || 0, 25) * 0.2,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limitCount)
        .map(item => item.course);

    return { focusCategory, courses: recommendations };
}

function getFocusCategory(courses: Course[]) {
    const counts = new Map<string, number>();

    courses.forEach(course => {
        if (!course.category) return;
        counts.set(course.category, (counts.get(course.category) || 0) + 1);
    });

    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}
