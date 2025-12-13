import { featureProps } from "@/types/feature";
import { BookMarked, Puzzle, ShieldCheck, ChartSpline, HandFist } from 'lucide-react';

export const features: featureProps[] = [
    {
        title: "Comprehensive Courses",
        description: "Dive into a vast library of courses that cover a wide range of topics. \nEach course is designed to provide in-depth knowledge and practical skills. \nLearn at your own pace and become an expert in your field.",
        icon: BookMarked,
    },
    {
        title: "Interactive Learning",
        description: "Engage with content that’s not just informative but interactive. \nTake quizzes, complete exercises, and challenge yourself with real-world scenarios. \nExperience learning that keeps you motivated and curious every step of the way.",
        icon: Puzzle,
    },
    {
        title: "Personalized Learning",
        description: "Receive learning paths tailored specifically to your strengths and interests. \nOur system recommends courses and resources that match your goals. \nEnjoy a learning experience that adapts to your pace and style.",
        icon: ShieldCheck,
    },
    {
        title: "Progress Tracking",
        description: "Monitor your learning journey with detailed progress insights. \nTrack milestones, achievements, and areas for improvement over time. \nStay motivated by seeing tangible results from your hard work.",
        icon: ChartSpline,
    },
    {
        title: "Community Support",
        description: "Connect with a thriving community of learners and experts. \nAsk questions, share knowledge, and collaborate on projects together. \nBenefit from a network that supports your growth every step of the way.",
        icon: HandFist,
    },
];


export const testimonials = [
    {
        name: 'Alice Johnson',
        role: 'Frontend Developer',
        message:
            'CheFu Academy transformed the way I learn. The courses are clear, interactive, and practical!',
        avatar: '/avatars/alice.jpg',
    },
    {
        name: 'Brian Smith',
        role: 'Student',
        message:
            'The personalized learning paths helped me focus on exactly what I needed. Highly recommended!',
        avatar: '/avatars/brian.jpg',
    },
    {
        name: 'Catherine Lee',
        role: 'Data Analyst',
        message:
            'I love the community support. I could always get help when I was stuck.',
        avatar: '/avatars/catherine.jpg',
    },
];