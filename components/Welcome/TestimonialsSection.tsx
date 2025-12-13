'use client';

import { Card } from '@/components/ui/card'; // optional, your Card component
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { testimonials } from '@/constants/Data';

const TestimonialsSection = () => {
    return (
        <section className="py-20  text-center">
            <h2 className="text-4xl font-bold mb-8">What Our Learners Say</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {testimonials.map((t, i) => (
                    <Card key={i} className="p-6">
                        <Avatar className="mx-auto mb-4">
                            <AvatarImage src={t.avatar} alt={t.name} />
                            <AvatarFallback>{t.name[0]}</AvatarFallback>
                        </Avatar>
                        <p className="text-gray-700 mb-2">
                            &quot;{t.message}&quot;
                        </p>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-gray-500">{t.role}</p>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsSection;
