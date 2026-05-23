export {};

type NativeSaveFilePayload = {
    title?: string;
    defaultPath?: string;
    data: string;
    encoding?: 'base64' | 'utf8';
    filters?: Array<{
        name: string;
        extensions: string[];
    }>;
};

type NativeSaveFileResult = {
    canceled: boolean;
    filePath?: string;
};

type NativeImportFileResult = {
    canceled: boolean;
    filePath?: string;
    fileName?: string;
    text?: string;
};

declare global {
    interface Window {
        chefuDesktop?: {
            isElectron: boolean;
            notify: (payload?: {
                title?: string;
                body?: string;
                silent?: boolean;
            }) => Promise<boolean>;
            saveFile: (
                payload: NativeSaveFilePayload,
            ) => Promise<NativeSaveFileResult>;
            importLearningFile: () => Promise<NativeImportFileResult>;
            cacheCourse: (course: unknown) => Promise<boolean>;
            listCachedCourses: () => Promise<Record<string, unknown>>;
            setAutoLaunch: (enabled: boolean) => Promise<boolean>;
            getAutoLaunch: () => Promise<boolean>;
            scheduleReminder: (minutes: number) => Promise<boolean>;
            setProgress: (payload: {
                value?: number;
                mode?: 'none' | 'normal' | 'indeterminate' | 'error' | 'paused';
            }) => Promise<boolean>;
        };
    }
}
