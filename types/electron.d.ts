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
                route?: string;
            }) => Promise<boolean>;
            saveFile: (
                payload: NativeSaveFilePayload,
            ) => Promise<NativeSaveFileResult>;
            importLearningFile: () => Promise<NativeImportFileResult>;
            cacheCourse: (course: unknown) => Promise<boolean>;
            listCachedCourses: () => Promise<Record<string, unknown>>;
            setAutoLaunch: (enabled: boolean) => Promise<boolean>;
            getAutoLaunch: () => Promise<boolean>;
            getAppInfo: () => Promise<{
                isPackaged: boolean;
                name: string;
                platform: string;
                userDataPath: string;
                version: string;
            }>;
            checkForUpdates: () => Promise<{
                currentVersion: string;
                downloadUrl?: string;
                error?: string;
                hasUpdate: boolean;
                latestVersion?: string;
                releaseUrl?: string;
            }>;
            openExternal: (url: string) => Promise<boolean>;
            copyText: (text: string) => Promise<boolean>;
            onMenuAction: (
                listener: (payload: {
                    type: string;
                    payload?: Record<string, unknown>;
                }) => void,
            ) => () => void;
            scheduleReminder: (minutes: number) => Promise<boolean>;
            setProgress: (payload: {
                value?: number;
                mode?: 'none' | 'normal' | 'indeterminate' | 'error' | 'paused';
            }) => Promise<boolean>;
        };
    }
}
