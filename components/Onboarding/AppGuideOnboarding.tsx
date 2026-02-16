'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Compass, GraduationCap, MessageSquareText, Settings2, Video } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

type GuideStep = {
    title: string;
    description: string;
    bullets: string[];
    route: string;
    icon: React.ComponentType<{ className?: string }>;
};

const guideSteps: GuideStep[] = [
    {
        title: 'Courses Hub',
        description: 'Discover all available courses and enroll in what you need next.',
        bullets: [
            'Use All Courses to explore topics',
            'Open My Courses to continue where you left off',
            'Track outcomes in Completed Courses',
        ],
        route: '/courses',
        icon: GraduationCap,
    },
    {
        title: 'Practice Mode',
        description:
            'Strengthen retention with Quiz, Flashcards, and Q&A practice workflows.',
        bullets: [
            'Quiz for scored assessments',
            'Flashcards for active recall',
            'Q&A for concept reinforcement',
        ],
        route: '/courses/practice',
        icon: Compass,
    },
    {
        title: 'Videos Library',
        description: 'Use video tracks to deepen understanding beyond text lessons.',
        bullets: [
            'Watch beginner videos for fundamentals',
            'Move to advanced videos for mastery',
            'Pair videos with practice mode',
        ],
        route: '/videos/beginner',
        icon: Video,
    },
    {
        title: 'Settings, Support & Feedback',
        description: 'Manage your account and reach us quickly when you need help.',
        bullets: [
            'Adjust profile, notifications, and security',
            'Open Support for assistance',
            'Submit Feedback to improve the platform',
        ],
        route: '/settings/account',
        icon: Settings2,
    },
];

export default function AppGuideOnboarding() {
    const { user, loading } = useAuthUser();
    const router = useRouter();
    const pathname = usePathname();
    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [completedLocally, setCompletedLocally] = useState(false);

    const isAppArea = useMemo(
        () =>
            pathname.startsWith('/courses') ||
            pathname.startsWith('/videos') ||
            pathname.startsWith('/settings') ||
            pathname.startsWith('/support') ||
            pathname.startsWith('/feedback'),
        [pathname],
    );

    if (loading || !user) return null;
    if (!isAppArea) return null;
    if (!user.onboardingComplete) return null;
    if (completedLocally || user.appGuideComplete) return null;

    const current = guideSteps[step];
    const Icon = current.icon;
    const progress = ((step + 1) / guideSteps.length) * 100;

    const handleDone = async () => {
        setSaving(true);
        try {
            await setDoc(
                doc(db, 'users', user.email),
                {
                    appGuideComplete: true,
                    appGuideCompletedAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                },
                { merge: true },
            );
            setCompletedLocally(true);
            toast.success('Guide completed. You are all set.');
        } catch (error) {
            console.error('Failed to save app guide completion:', error);
            toast.error('Could not complete guide. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSkip = async () => {
        await handleDone();
    };

    return (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-3xl border-border/60 shadow-2xl">
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MessageSquareText className="h-4 w-4" />
                            <span>Platform guide</span>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleSkip}
                            disabled={saving}
                        >
                            Skip
                        </Button>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl border bg-muted/30 p-2">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{current.title}</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {current.description}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ul className="space-y-2 text-sm">
                        {current.bullets.map(bullet => (
                            <li key={bullet} className="rounded-md border bg-muted/20 p-2.5">
                                {bullet}
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setStep(prev => Math.max(prev - 1, 0))}
                            disabled={step === 0 || saving}
                        >
                            Back
                        </Button>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push(current.route)}
                                disabled={saving}
                            >
                                Open This Section
                            </Button>
                            {step < guideSteps.length - 1 ? (
                                <Button
                                    onClick={() =>
                                        setStep(prev =>
                                            Math.min(prev + 1, guideSteps.length - 1),
                                        )
                                    }
                                    disabled={saving}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button onClick={handleDone} disabled={saving}>
                                    {saving ? 'Finishing...' : 'Done'}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
