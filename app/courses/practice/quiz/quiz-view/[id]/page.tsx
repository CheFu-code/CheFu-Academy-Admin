'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePracticeCourses } from '@/hooks/usePracticeCourses';
import { useParams } from 'next/navigation';
import React from 'react';

const Quiz = () => {
    const params = useParams();
    const { courses, loading } = usePracticeCourses();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const course = courses.find(item => item.id === id);
    const quizzes = course?.quiz || [];

    if (loading) {
        return <p className="text-sm text-muted-foreground">Loading quiz...</p>;
    }

    if (!course) {
        return <p className="text-sm text-muted-foreground">Course not found.</p>;
    }

    if (quizzes.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                This course does not have quiz content yet.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">{course.courseTitle} Quiz</h1>
            <div className="space-y-4">
                {quizzes.map((item, index) => (
                    <Card key={`${item.question}-${index}`}>
                        <CardHeader>
                            <CardTitle>Question {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p>{item.question}</p>
                            <ul className="list-disc pl-5 space-y-1">
                                {item.options?.map((option, optionIndex) => (
                                    <li key={`${option}-${optionIndex}`}>{option}</li>
                                ))}
                            </ul>
                            <div>
                                <p className="text-xs text-muted-foreground">Correct answer</p>
                                <p>{item.correctAns}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Quiz;
