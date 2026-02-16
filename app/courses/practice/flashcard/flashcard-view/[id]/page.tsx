'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePracticeCourses } from '@/hooks/usePracticeCourses';
import { useParams } from 'next/navigation';

const Flashcard = () => {
    const params = useParams();
    const { courses, loading } = usePracticeCourses();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const course = courses.find(item => item.id === id);
    const flashcards = course?.flashcards || [];

    if (loading) {
        return <p className="text-sm text-muted-foreground">Loading flashcards...</p>;
    }

    if (!course) {
        return <p className="text-sm text-muted-foreground">Course not found.</p>;
    }

    if (flashcards.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                This course does not have flashcards yet.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">{course.courseTitle} Flashcards</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashcards.map((item, index) => (
                    <Card key={`${item.front}-${index}`}>
                        <CardHeader>
                            <CardTitle>Card {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Front</p>
                                <p>{item.front}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Back</p>
                                <p>{item.back}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Flashcard;
