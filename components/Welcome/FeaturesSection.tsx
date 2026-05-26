import { features } from '@/constants/Data';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader } from '../ui/card';

const FeaturesSection = () => {
    const accents = [
        'text-cyan-500 bg-cyan-500/10',
        'text-emerald-500 bg-emerald-500/10',
        'text-amber-500 bg-amber-500/10',
        'text-rose-500 bg-rose-500/10',
        'text-indigo-500 bg-indigo-500/10',
    ];
    const polishedCopy: Record<string, string> = {
        'Interactive Learning':
            'Use quizzes, flashcards, examples, and active recall to turn each lesson into something you can remember.',
    };

    return (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl space-y-3">
                    <Badge variant="outline" className="w-fit">
                        Why learners stay on track
                    </Badge>
                    <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                        A calmer, smarter way to move from curiosity to skill.
                    </h2>
                </div>
                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                    CheFu Academy combines structured courses with practice
                    loops, progress signals, and AI support so every session has
                    a clear next step.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const accent = accents[index % accents.length];

                    return (
                        <Card
                            key={feature.title}
                            className="home-lift group h-full border-border/70 bg-card/80 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                        >
                            <CardHeader className="space-y-4">
                                <div
                                    className={`flex size-11 items-center justify-center rounded-lg ${accent}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-semibold leading-6">
                                    {feature.title}
                                </h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {polishedCopy[feature.title] ||
                                        feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
};

export default FeaturesSection;
