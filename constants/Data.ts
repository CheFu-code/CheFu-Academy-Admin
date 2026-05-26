import { featureProps } from '@/types/feature';
import {
    IconDashboard,
    IconListDetails,
    IconMail,
    IconMessage,
    IconMoneybag,
    IconReport,
    IconSettings,
    IconVideo,
} from '@tabler/icons-react';
import {
    BookMarked,
    ChartSpline,
    HandFist,
    Puzzle,
    ShieldCheck,
    Ticket,
} from 'lucide-react';

export const features: featureProps[] = [
    {
        title: 'Comprehensive Courses',
        description:
            'Follow guided courses built for practical skills, clear lessons, and steady progress across high-value topics.',
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
            'Pick up from your last session and get clearer paths based on your goals, pace, and recent activity.',
        icon: ShieldCheck,
    },
    {
        title: 'Progress Tracking',
        description:
            'See completed chapters, recent study activity, scores, and milestones without digging through menus.',
        icon: ChartSpline,
    },
    {
        title: 'Community Support',
        description:
            'Get help through support, learning guidance, and tools designed to keep momentum when topics get hard.',
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

export const SDK_URL =
    process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL || 'http://localhost:4000'
        : process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.chefuinc.com';
export const WEBSITE_URL = 'https://academy.chefuinc.com';
export const BACKEND_URL = 'https://chefu-academy-tmzx.onrender.com';

export const DEFAULT_PREFERENCES = {
    general: false,
    marketing: false,
    activity: false,
    security: true,
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
    {
        name: 'Support Tickets',
        url: '/admin/support-tickets/all',
        icon: Ticket,
    },
];

export const advanced = [
    {
        name: 'Send Emails',
        url: '/admin/send-emails',
        icon: IconMail,
    },
    {
        name: 'Billing Section',
        url: '/admin/billing',
        icon: IconMoneybag,
    },
    {
        name: 'System Settings',
        url: '/admin/settings',
        icon: IconSettings,
    },
    {
        name: 'Automation & Tools',
        url: '/admin/automation',
        icon: Puzzle,
    },
    {
        name: 'Community / Engagement',
        url: '/admin/community',
        icon: ShieldCheck,
    },
];

export const PRIORITY_VALUES = [
    'all',
    'urgent',
    'high',
    'medium',
    'low',
] as const;
