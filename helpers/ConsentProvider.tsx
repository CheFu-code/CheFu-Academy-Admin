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

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'accepted' || saved === 'rejected') {
            setConsentState(saved);
        }
    }, []);

    const setConsent = (choice: 'accepted' | 'rejected') => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, choice);
        }
        setConsentState(choice);
    };

    const resetConsent = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
        setConsentState(null);
    };

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
