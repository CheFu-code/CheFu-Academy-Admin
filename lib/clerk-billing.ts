'use client';

type ClerkBillingCheckout = {
    planId: string;
    planPeriod: 'month' | 'annual';
};

type ClerkBilling = {
    startCheckout: (params: ClerkBillingCheckout) => Promise<unknown>;
};

type ClerkBrowser = {
    billing?: ClerkBilling;
    load: (options?: Record<string, unknown>) => Promise<void>;
    openSignIn: (options?: Record<string, unknown>) => void;
    user?: unknown;
};

declare global {
    interface Window {
        Clerk?: ClerkBrowser;
        __internal_ClerkUICtor?: unknown;
    }
}

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkFrontendApiUrl = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL;

let clerkPromise: Promise<ClerkBrowser> | null = null;

function loadScript(src: string, attributes: Record<string, string> = {}) {
    return new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
            `script[src="${src}"]`,
        );

        if (existing?.dataset.loaded === 'true') {
            resolve();
            return;
        }

        const script = existing || document.createElement('script');
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = src;

        Object.entries(attributes).forEach(([key, value]) => {
            script.setAttribute(key, value);
        });

        script.addEventListener('load', () => {
            script.dataset.loaded = 'true';
            resolve();
        });
        script.addEventListener('error', () => {
            reject(new Error('Failed to load Clerk billing scripts.'));
        });

        if (!existing) {
            document.body.appendChild(script);
        }
    });
}

export async function loadClerkBilling() {
    if (!clerkPublishableKey || !clerkFrontendApiUrl) {
        throw new Error(
            'Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and NEXT_PUBLIC_CLERK_FRONTEND_API_URL to use Clerk Billing.',
        );
    }

    if (clerkPromise) return clerkPromise;

    clerkPromise = (async () => {
        const baseUrl = `https://${clerkFrontendApiUrl.replace(/^https?:\/\//, '')}`;

        await loadScript(`${baseUrl}/npm/@clerk/ui@1/dist/ui.browser.js`);
        await loadScript(`${baseUrl}/npm/@clerk/clerk-js@6/dist/clerk.browser.js`, {
            'data-clerk-publishable-key': clerkPublishableKey,
        });

        if (!window.Clerk) {
            throw new Error('Clerk billing did not initialize.');
        }

        await window.Clerk.load({
            ui: {
                ClerkUI: window.__internal_ClerkUICtor,
            },
        });

        return window.Clerk;
    })();

    return clerkPromise;
}
