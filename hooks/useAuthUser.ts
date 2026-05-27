"use client";

import { auth, db } from "@/lib/firebase";
import { getChefuSessionUser } from "@/lib/chefu-account";
import { User } from "@/types/user";
import { doc, getDoc } from "@firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const DEFAULT_ROLES = ["Student"];

async function loadAcademyProfile(
    email: string,
    fallback: Partial<User> = {},
) {
    const normalizedEmail = email.trim();
    const fallbackName =
        fallback.fullname || normalizedEmail.split("@")[0] || "";
    const docRef = doc(db, "users", normalizedEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const profile = docSnap.data() as Partial<User>;

        return {
            ...fallback,
            ...profile,
            email: profile.email || normalizedEmail,
            uid: profile.uid || fallback.uid,
            fullname: profile.fullname || fallbackName,
            roles:
                Array.isArray(profile.roles) && profile.roles.length > 0
                    ? profile.roles
                    : fallback.roles || DEFAULT_ROLES,
            onboardingComplete: Boolean(profile.onboardingComplete),
            appGuideComplete: Boolean(profile.appGuideComplete),
        } as User;
    }

    return {
        ...fallback,
        email: normalizedEmail,
        fullname: fallbackName,
        roles: fallback.roles || DEFAULT_ROLES,
        onboardingComplete: false,
        appGuideComplete: false,
    } as User;
}

export function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser && firebaseUser.email) {
                    const profile = await loadAcademyProfile(firebaseUser.email, {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        fullname:
                            firebaseUser.displayName ||
                            firebaseUser.email.split("@")[0],
                        profilePicture: firebaseUser.photoURL || undefined,
                    });
                    setUser(profile);
                } else {
                    const sessionUser = await getChefuSessionUser();
                    const profile = await loadAcademyProfile(sessionUser.email, {
                        uid: sessionUser.uid,
                        email: sessionUser.email,
                        fullname: sessionUser.displayName || sessionUser.email.split("@")[0],
                        roles: sessionUser.roles,
                        profilePicture: sessionUser.photoURL || undefined,
                    });
                    setUser(profile);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}
