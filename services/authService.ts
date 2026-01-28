import { BACKEND_URL, DEFAULT_PREFS } from "@/constants/Data";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import os from "os";
import { toast } from "sonner";

export const saveUser = async (user: User, fullname: string, email: string) => {
    try {
        const deviceInfo = {
            platform: os.platform(),        // 'darwin', 'win32', 'linux'
            osType: os.type(),              // 'Linux', 'Darwin', 'Windows_NT'
            osRelease: os.release(),        // OS version
            arch: os.arch(),                // 'x64', 'arm', etc.
        };

        const userEmail = (user.email ?? email)?.trim();
        const now = new Date();

        const userFullName = user.displayName || fullname || "";
        const userPhoto = user?.photoURL ?? null;
        const userProvider =
            user?.providerData?.[0]?.providerId ?? user?.providerId ?? "email";

        const userDocRef = doc(db, "users", userEmail);
        const userDoc = await getDoc(userDocRef);


        if (userDoc.exists()) {
            const existingData = userDoc.data();
            const updatedData = {
                ...existingData,
                lastLogin: now,
                updatedAt: now,
            };
            await setDoc(userDocRef, updatedData, { merge: true });
            toast.success("Welcome back!");
            return updatedData;
        } else {
            const data = {
                fullname: userFullName,
                email: userEmail,
                member: false,
                isVerified: user.emailVerified,
                createdAt: now,
                updatedAt: now,
                uid: user.uid,
                emailPreferences: DEFAULT_PREFS,
                profilePicture: userPhoto,
                lastLogin: now,
                provider: userProvider,
                onboardingComplete: false,
                roles: ["Student"],
                bio: "",
                language: "en",
                subscriptionStatus: "free",
                deviceInfo,
            };

            const cleanData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== undefined)
            );

            await setDoc(userDocRef, cleanData);
            await sendWelcomeEmail(userEmail, userFullName);
            toast.success("Welcome! Your account has been created.");
            return cleanData;
        }
    } catch (e) {
        throw new Error(`Failed to save your data. Please try again later. ${e}`);
    }
};


const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        await fetch(
            `${BACKEND_URL}/api/email/send-welcome`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name }),
            }
        );
    } catch (error) {
        console.error("Failed to send welcome email:", error);
    }
};