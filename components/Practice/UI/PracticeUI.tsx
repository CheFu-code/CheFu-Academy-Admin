import Header from '@/components/Shared/Header';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BookOpenCheck, Layers3, MessageCircleQuestion } from 'lucide-react';
import React from 'react';

const PracticeUI = ({
    router,
}: {
    router: ReturnType<typeof import('next/navigation').useRouter>;
}) => {
    const practiceItems = [
        {
            title: 'Quiz',
            description:
                "Test your knowledge and measure what you've retained with focused questions.",
            route: '/courses/practice/quiz',
            icon: BookOpenCheck,
            accent: 'from-blue-500/20 to-cyan-500/10',
            chip: 'Challenge Mode',
        },
        {
            title: 'Flashcard',
            description:
                'Review key concepts quickly with active recall and spaced repetition.',
            route: '/courses/practice/flashcard',
            icon: Layers3,
            accent: 'from-amber-500/20 to-orange-500/10',
            chip: 'Memory Mode',
        },
        {
            title: 'Question & Answer',
            description:
                'Practice thinking first, reveal explanations, and self-check your mastery.',
            route: '/courses/practice/questionAns',
            icon: MessageCircleQuestion,
            accent: 'from-emerald-500/20 to-teal-500/10',
            chip: 'Reflection Mode',
        },
    ];

    return (
        <>
            <Header
                header="Practice"
                description="Strengthen your skills with Quizzes, Flashcards, and Question & Answer."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {practiceItems.map(item => {
                    const Icon = item.icon;

                    return (
                        <Card
                            key={item.title}
                            onClick={() => router.push(item.route)}
                            className="group relative cursor-pointer overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                        >
                            <div
                                className={`pointer-events-none absolute inset-0 bg-linear-to-br ${item.accent} opacity-80`}
                            />
                            <div className="relative">
                                <CardHeader className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background/80">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="rounded-full border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">
                                            {item.chip}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                    <CardDescription className="text-sm leading-6 text-foreground/70">
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-medium text-primary/90 group-hover:underline">
                                        Start practice
                                    </p>
                                </CardContent>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </>
    );
};

export default PracticeUI;
