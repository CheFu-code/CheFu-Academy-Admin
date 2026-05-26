import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { testimonials } from '@/constants/Data';
import { Quote, Star } from 'lucide-react';

const TestimonialsSection = () => {
    return (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
                <Badge variant="outline" className="mb-4">
                    Learner outcomes
                </Badge>
                <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                    People come for the courses and stay for the momentum.
                </h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Learners use CheFu Academy to organize study time, practice
                    with confidence, and keep improving without losing their
                    place.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {testimonials.map((t, i) => (
                    <Card
                        key={t.name}
                        className="home-lift h-full border-border/70 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <Quote className="h-6 w-6 text-cyan-500" />
                            <div className="flex gap-1 text-amber-500">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                        key={`${t.name}-${index}`}
                                        className="h-4 w-4 fill-current"
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="min-h-24 text-sm leading-7 text-muted-foreground">
                            &quot;{t.message}&quot;
                        </p>
                        <div className="mt-6 flex items-center gap-3 border-t pt-5">
                            <Avatar>
                                <AvatarImage src={t.avatar} alt={t.name} />
                                <AvatarFallback>{t.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{t.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t.role}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsSection;
