export const notificationPreferenceKeys = [
    'activity',
    'general',
    'marketing',
    'security',
    'courseReminders',
    'aiCourseCompletion',
    'weeklyProgressSummary',
] as const;

export type NotificationPreferenceKey =
    (typeof notificationPreferenceKeys)[number];

export type NotificationPreferences = Record<NotificationPreferenceKey, boolean>;

export const defaultNotificationPreferences: NotificationPreferences = {
    activity: false,
    general: false,
    marketing: false,
    security: true,
    courseReminders: true,
    aiCourseCompletion: true,
    weeklyProgressSummary: false,
};

export const normalizeNotificationPreferences = (
    value?: Partial<NotificationPreferences> | null,
): NotificationPreferences => ({
    ...defaultNotificationPreferences,
    ...(value || {}),
});
