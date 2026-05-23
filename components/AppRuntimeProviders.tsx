'use client';

import { TrackPageView } from '@/components/Cookies/TrackPageView';
import AppGuideOnboarding from '@/components/Onboarding/AppGuideOnboarding';
import OnboardingGate from '@/components/Onboarding/OnboardingGate';
import RedirectIfNoCountry from '@/components/RedirectIfNoCountry';
import DesktopToastBridge from './DesktopToastBridge';

export default function AppRuntimeProviders() {
    return (
        <>
            <TrackPageView />
            <DesktopToastBridge />
            <RedirectIfNoCountry />
            <OnboardingGate />
            <AppGuideOnboarding />
        </>
    );
}
