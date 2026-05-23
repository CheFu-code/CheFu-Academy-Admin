export const normalizeOwnerEmail = (value?: string | null) =>
    String(value || '').trim().toLowerCase();

export const ownerEmailDocPrefix = (value?: string | null) =>
    normalizeOwnerEmail(value).replace(/[@.]/g, '_');

export const isCourseOwnerEmail = (
    courseOwnerEmail?: string | null,
    userEmail?: string | null,
) =>
    Boolean(courseOwnerEmail && userEmail) &&
    normalizeOwnerEmail(courseOwnerEmail) === normalizeOwnerEmail(userEmail);

type CourseAccessLike = {
    id?: string | null;
    docId?: string | null;
    createdBy?: string | null;
    ownerEmail?: string | null;
    createdByEmail?: string | null;
    userEmail?: string | null;
    enrolledBy?: string | null;
    enrolledByEmail?: string | null;
    createdByUid?: string | null;
    ownerUid?: string | null;
    userId?: string | null;
    uid?: string | null;
    enrolled?: boolean | null;
};

type UserAccessLike = {
    email?: string | null;
    uid?: string | null;
};

export const canAccessCourseAsLearner = (
    course?: CourseAccessLike | null,
    user?: UserAccessLike | null,
) => {
    if (!course || !user) return false;

    const userEmail = normalizeOwnerEmail(user.email);
    const userUid = String(user.uid || '').trim();
    const emailFields = [
        course.createdBy,
        course.ownerEmail,
        course.createdByEmail,
        course.userEmail,
        course.enrolledBy,
        course.enrolledByEmail,
    ];
    const uidFields = [
        course.createdBy,
        course.createdByUid,
        course.ownerUid,
        course.userId,
        course.uid,
    ];

    if (
        userEmail &&
        emailFields.some(value => normalizeOwnerEmail(value) === userEmail)
    ) {
        return true;
    }

    if (userUid && uidFields.some(value => String(value || '').trim() === userUid)) {
        return true;
    }

    const docIds = [course.id, course.docId].filter(Boolean).map(String);
    const prefix = ownerEmailDocPrefix(userEmail);
    if (
        Boolean(course.enrolled) &&
        prefix &&
        docIds.some(docId => docId.toLowerCase().startsWith(`${prefix}_`))
    ) {
        return true;
    }

    return false;
};
