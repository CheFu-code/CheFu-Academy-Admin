'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const CallToActionSection = () => {
    const router = useRouter();
    return (
        <section className="py-20 bg-indigo-600 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">
                Start Your Learning Journey Today
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of smart learners who are improving their skills
                and achieving their goals. Sign up now and get instant access to
                all courses and resources.
            </p>
            <Button
                onClick={() => router.push('/courses/create-course')}
                className="bg-white text-indigo-600 hover:bg-gray-400 px-8 py-4 font-semibold cursor-pointer"
            >
                Get Started
            </Button>
        </section>
    );
};

export default CallToActionSection;
