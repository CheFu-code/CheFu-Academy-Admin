'use client';

import CallToActionSection from '@/components/Welcome/CallToActionSection';
import FeaturesSection from '@/components/Welcome/FeaturesSection';
import Footer from '@/components/Welcome/Footer';
import HeroSection from '@/components/Welcome/HeroSection';
import PricingSection from '@/components/Welcome/PricingSection';
import TestimonialsSection from '@/components/Welcome/TestimonialsSection';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/user';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Home = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser && firebaseUser.email) {
                const docRef = doc(db, 'users', firebaseUser.email);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) setUser(docSnap.data() as User);
                else
                    setUser({
                        email: firebaseUser.email,
                        fullname: '',
                    } as User); // fallback
            } else {
                setUser(null);
            }
            setLoading(false); // finished checking auth
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading && user) {
            router.replace('/courses');
        }
    }, [loading, user, router]);

    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <TestimonialsSection />
            <PricingSection />
            <CallToActionSection />
            <Footer />
        </>
    );
};

export default Home;
