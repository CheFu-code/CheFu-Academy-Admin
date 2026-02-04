import { featureProps } from '@/types/feature';
import {
    IconDashboard,
    IconListDetails,
    IconMessage,
    IconReport,
    IconVideo,
} from '@tabler/icons-react';
import {
    BookMarked,
    Puzzle,
    ShieldCheck,
    ChartSpline,
    HandFist,
    Ticket,
} from 'lucide-react';

export const features: featureProps[] = [
    {
        title: 'Comprehensive Courses',
        description:
            'Dive into a vast library of courses that cover a wide range of topics. \nEach course is designed to provide in-depth knowledge and practical skills. \nLearn at your own pace and become an expert in your field.',
        icon: BookMarked,
    },
    {
        title: 'Interactive Learning',
        description:
            'Engage with content that’s not just informative but interactive. \nTake quizzes, complete exercises, and challenge yourself with real-world scenarios. \nExperience learning that keeps you motivated and curious every step of the way.',
        icon: Puzzle,
    },
    {
        title: 'Personalized Learning',
        description:
            'Receive learning paths tailored specifically to your strengths and interests. \nOur system recommends courses and resources that match your goals. \nEnjoy a learning experience that adapts to your pace and style.',
        icon: ShieldCheck,
    },
    {
        title: 'Progress Tracking',
        description:
            'Monitor your learning journey with detailed progress insights. \nTrack milestones, achievements, and areas for improvement over time. \nStay motivated by seeing tangible results from your hard work.',
        icon: ChartSpline,
    },
    {
        title: 'Community Support',
        description:
            'Connect with a thriving community of learners and experts. \nAsk questions, share knowledge, and collaborate on projects together. \nBenefit from a network that supports your growth every step of the way.',
        icon: HandFist,
    },
];

export const testimonials = [
    {
        name: 'Alice Johnson',
        role: 'Frontend Developer',
        message:
            'CheFu Academy transformed the way I learn. The courses are clear, interactive, and practical!',
        avatar: '/logo.png',
    },
    {
        name: 'Brian Smith',
        role: 'Student',
        message:
            'The personalized learning paths helped me focus on exactly what I needed. Highly recommended!',
        avatar: '/avatar.jpg',
    },
    {
        name: 'Catherine Lee',
        role: 'Data Analyst',
        message:
            'I love the community support. I could always get help when I was stuck.',
        avatar: '/logo.png',
    },
];

export const plans = [
    {
        name: 'Free',
        price: '0',
        features: [
            'Access to basic courses',
            'Community support',
            'Limited progress tracking',
        ],
    },
    {
        name: 'Pro',
        price: '14.99',
        features: [
            'All courses included',
            'Advanced progress tracking',
            'Personalized learning paths',
        ],
    },
    {
        name: 'Premium',
        price: '29.99',
        features: [
            'Everything in Pro',
            '1-on-1 mentorship',
            'Priority support',
            'Certificates of completion',
        ],
    },
];

export const navigationItems = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Courses',
        href: '/courses',
    },
    {
        name: 'Videos',
        href: '/videos/all-videos',
    },
    {
        name: 'Documentation',
        href: '/docs',
    },
];

export const SDK_URL = 'https://chefu-academy-sdk.onrender.com';
export const WEBSITE_URL = 'https://chefu-academy.vercel.app';
export const BACKEND_URL = 'https://chefu-academy-tmzx.onrender.com';

export const DEFAULT_PREFERENCES = {
    general: false,
    marketing: false,
    activity: false,
    security: true,
};

export const supportKpis = {
    open: 12,
    pendingResponses: 5,
    resolvedToday: 8,
    overdue: 3,
};

export const navMain = [
    {
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: IconDashboard,
    },
    {
        title: 'Messages',
        url: '/admin/messages',
        icon: IconMessage,
    },
    {
        title: 'Courses',
        url: '/admin/courses',
        icon: IconListDetails,
    },
    {
        title: 'Videos',
        url: '/admin/videos',
        icon: IconVideo,
    },
];

export const documents = [
    {
        name: 'Reports',
        url: '/admin/reports',
        icon: IconReport,
    },
    { name: 'Support Tickets', url: '/admin/support-tickets', icon: Ticket },
];
