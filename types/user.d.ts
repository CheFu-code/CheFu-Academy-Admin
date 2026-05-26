import { NotificationPreferences } from "@/lib/notificationPreferences";
import { Timestamp } from "firebase/firestore";

export interface User {
    id: string;
    email: string;
    fullname: string;
    profilePicture?: string;
    bio?: string;
    country: string;
    countryCode?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    fcmToken?: string;
    isVerified: boolean;
    language: string;
    learningGoal?: string;
    skillLevel?: 'beginner' | 'intermediate' | 'advanced';
    learningInterests?: string[];
    weeklyLearningGoal?: number;
    lessonStyle?: 'short' | 'detailed' | 'example-heavy';
    defaultCourseDifficulty?: 'beginner' | 'intermediate' | 'advanced';
    preferredContentFormat?: 'text' | 'examples' | 'quizzes';
    aiTutorSuggestions?: boolean;
    privacy?: {
        publicProfile?: boolean;
        showCompletedCourses?: boolean;
        showCountry?: boolean;
        personalizedAiRecommendations?: boolean;
    };
    lastLogin: Timestamp;
    lastSeen: Timestamp;
    member: boolean;
    favoriteCourseIds?: string[];
    favoriteCoursesUpdatedAt?: Timestamp;
    onboardingComplete: boolean;
    appGuideComplete?: boolean;
    provider: string;
    roles: string[];
    subscriptionStatus: string;
    uid: string;
    memberUntil?: Timestamp;
    emailPreferences: NotificationPreferences;
    deviceInfo: {
        deviceBrand: string;
        deviceModel: string;
        deviceName: string;
        isRTL: boolean;
        isTablet: boolean;
        manufacturer: string;
        orientation: string;
        os: string;
        osVersion: number;
        screenHeight: number;
        screenWidth: number;
        totalMemory: number;
    };

}


export interface UserDropdownProps {
    user: User | null;
}
