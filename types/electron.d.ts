export {};

declare global {
    interface Window {
        chefuDesktop?: {
            isElectron: boolean;
            notify: (payload?: {
                title?: string;
                body?: string;
                silent?: boolean;
            }) => Promise<boolean>;
        };
    }
}
