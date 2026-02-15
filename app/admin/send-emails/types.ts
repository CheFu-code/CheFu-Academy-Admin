export type CampaignType = "general" | "marketing";
export type EmailPreferenceKey = CampaignType | "activity" | "security";

export type AudienceUser = {
    id: string;
    email: string;
    member?: boolean;
    subscriptionStatus?: string;
    emailPreferences?: Partial<Record<EmailPreferenceKey, boolean>>;
};

export type PreferenceAudience =
    | "All Subscribers"
    | "Customers (All)"
    | "General Subscribers"
    | "Marketing Subscribers"
    | "Security Subscribers"
    | "Activity Subscribers";

export type ActiveTab = "audience" | "compose" | "preview" | "schedule";
export type PreviewDevice = "desktop" | "mobile";

export type EmailFormState = {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    audience: PreferenceAudience;
    subjectA: string;
    subjectB: string;
    preheader: string;
    contentA: string;
    contentB: string;
    promoCode: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    trackOpens: boolean;
    trackClicks: boolean;
    enableAB: boolean;
    sendTestTo: string;
    scheduleAt: Date | undefined;
    timezone: string;
};

export type SetFormField = <K extends keyof EmailFormState>(
    key: K,
    value: EmailFormState[K]
) => void;

export const DEFAULT_SCHEDULE_TIME = "09:00";

export const INITIAL_FORM: EmailFormState = {
    fromName: "Marketing Team",
    fromEmail: "marketing@chefuinc.com",
    replyTo: "support@chefuinc.com",
    audience: "All Subscribers",
    subjectA: "",
    subjectB: "",
    preheader: "",
    contentA: "",
    contentB: "",
    promoCode: "",
    utmSource: "newsletter",
    utmMedium: "email",
    utmCampaign: "",
    trackOpens: true,
    trackClicks: true,
    enableAB: false,
    sendTestTo: "",
    scheduleAt: undefined,
    timezone: "Africa/Johannesburg",
};
