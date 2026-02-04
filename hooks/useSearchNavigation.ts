'use client';

import { useRouter } from "next/navigation";

export const useSafeNavigation = (text: string) => {
    const router = useRouter()
    const goToSearchRes = () => {
        router.push(`/courses/search?query=${encodeURIComponent(text)}`);
    }
    return { goToSearchRes }
};