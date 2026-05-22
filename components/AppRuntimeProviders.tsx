'use client';

import { TrackPageView } from '@/components/Cookies/TrackPageView';
import AppGuideOnboarding from '@/components/Onboarding/AppGuideOnboarding';
import OnboardingGate from '@/components/Onboarding/OnboardingGate';
import RedirectIfNoCountry from '@/components/RedirectIfNoCountry';

export default function AppRuntimeProviders() {
    return (
        <>
            <TrackPageView />
            <RedirectIfNoCountry />
            <OnboardingGate />
            <AppGuideOnboarding />
        </>
    );
}
