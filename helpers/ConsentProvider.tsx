'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';

type ConsentChoice = 'accepted' | 'rejected' | null;

type ConsentContextType = {
    consent: ConsentChoice;
    setConsent: (choice: Exclude<ConsentChoice, null>) => void;
    resetConsent: () => void; // for “Manage cookies”
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const STORAGE_KEY = 'cookie_consent_choice';

export function ConsentProvider({ children }: { children: ReactNode }) {
    const [consent, setConsentState] = useState<ConsentChoice>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // SSR-safe: only touch localStorage on client
        const saved =
            typeof window !== 'undefined'
                ? localStorage.getItem(STORAGE_KEY)
                : null;
        if (saved === 'accepted' || saved === 'rejected') {
            setConsentState(saved);
        }
        setReady(true);
    }, []);

    const setConsent = (choice: 'accepted' | 'rejected') => {
        localStorage.setItem(STORAGE_KEY, choice);
        setConsentState(choice);
    };

    const resetConsent = () => {
        localStorage.removeItem(STORAGE_KEY);
        setConsentState(null);
    };

    // Avoid flashing before hydration completes
    if (!ready) return null;

    return (
        <ConsentContext.Provider value={{ consent, setConsent, resetConsent }}>
            {children}
        </ConsentContext.Provider>
    );
}

export function useConsent() {
    const ctx = useContext(ConsentContext);
    if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
    return ctx;
}
