export const normalizeOwnerEmail = (value?: string | null) =>
    String(value || '').trim().toLowerCase();

export const isCourseOwnerEmail = (
    courseOwnerEmail?: string | null,
    userEmail?: string | null,
) =>
    Boolean(courseOwnerEmail && userEmail) &&
    normalizeOwnerEmail(courseOwnerEmail) === normalizeOwnerEmail(userEmail);
