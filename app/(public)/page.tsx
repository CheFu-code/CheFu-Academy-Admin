import AboutUsUI from '@/components/pagesUI/AboutUsUI';
import CallToActionSection from '@/components/Welcome/CallToActionSection';
import FeaturesSection from '@/components/Welcome/FeaturesSection';
import Footer from '@/components/Welcome/Footer';
import HeroSection from '@/components/Welcome/HeroSection';
import Integration from '@/components/Welcome/Integration';
import PricingSection from '@/components/Welcome/PricingSection';
import TestimonialsSection from '@/components/Welcome/TestimonialsSection';
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
    return {
        title: 'CheFu Academy | AI Courses, Practice, and Progress Tracking',
        description:
            'Build practical skills with CheFu Academy through guided AI courses, quizzes, flashcards, smart resume, desktop learning, and progress tracking.',
    };
}

const Home = () => {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <TestimonialsSection />
            <Integration />
            <AboutUsUI />
            {/* <ChatSupport /> */}
            <PricingSection />
            <CallToActionSection />
            <Footer />
        </>
    );
};

export default Home;
