'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePracticeCourses } from '@/hooks/usePracticeCourses';
import { useParams } from 'next/navigation';
import React from 'react';

const QuestionAns = () => {
    const params = useParams();
    const { courses, loading } = usePracticeCourses();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const course = courses.find(item => item.id === id);
    const questionAns = course?.qa || [];

    if (loading) {
        return <p className="text-sm text-muted-foreground">Loading Q&A...</p>;
    }

    if (!course) {
        return <p className="text-sm text-muted-foreground">Course not found.</p>;
    }

    if (questionAns.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                This course does not have Q&A content yet.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">{course.courseTitle} Q&A</h1>
            <div className="space-y-4">
                {questionAns.map((item, index) => (
                    <Card key={`${item.question}-${index}`}>
                        <CardHeader>
                            <CardTitle>Question {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Question</p>
                                <p>{item.question}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Answer</p>
                                <p>{item.answer}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default QuestionAns;
