'use client';

import { generateChapterHelp } from '@/config/AIModel';
import { ChapterContentItem } from '@/types/course';
import { BookOpenCheck, Loader, Send, Sparkles } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { formatParagraph } from '@/utils/formatParagraph';

type TutorResponse = {
    answer?: string;
    keyPoints?: string[];
    followUps?: string[];
};

const quickQuestions = [
    'Explain this in simpler terms',
    'Give me a real-world example',
    'What should I remember from this lesson?',
];

const truncate = (value = '', maxLength = 4000) =>
    value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

const parseTutorResponse = (value: string): TutorResponse => {
    try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && parsed ? parsed : { answer: value };
    } catch {
        return { answer: value };
    }
};

const ChapterAiTutor = ({
    courseTitle,
    chapterTitle,
    lessonIndex,
    totalLessons,
    content,
    lessonKey,
}: {
    courseTitle: string;
    chapterTitle: string;
    lessonIndex: number;
    totalLessons: number;
    content: ChapterContentItem;
    lessonKey: string;
}) => {
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState<TutorResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setQuestion('');
        setAnswer(null);
        setLoading(false);
        setOpen(false);
    }, [lessonKey]);

    const lessonContext = useMemo(
        () =>
            [
                `Course: ${courseTitle}`,
                `Chapter: ${chapterTitle}`,
                `Lesson: ${lessonIndex + 1} of ${totalLessons}`,
                content.topic ? `Topic: ${content.topic}` : '',
                content.explain ? `Explanation: ${content.explain}` : '',
                content.code ? `Code: ${content.code}` : '',
                content.example ? `Example: ${content.example}` : '',
            ]
                .filter(Boolean)
                .join('\n\n'),
        [chapterTitle, content, courseTitle, lessonIndex, totalLessons],
    );

    const askTutor = async (nextQuestion?: string) => {
        const finalQuestion = (nextQuestion || question).trim();

        if (!finalQuestion) {
            toast.error('Ask a question about this lesson first.');
            return;
        }

        setLoading(true);
        setAnswer(null);
        setOpen(true);

        try {
            const response = await generateChapterHelp([
                {
                    role: 'user',
                    parts: [
                        {
                            text: `You are CheFu Academy's helpful AI tutor.

Help the learner understand the current lesson. Use the lesson context only when possible. If the learner asks for something outside the lesson, answer briefly and connect it back to the lesson.

Return JSON only in this exact shape:
{
  "answer": "A clear, friendly explanation in 2-5 short paragraphs.",
  "keyPoints": ["2-4 short bullets the learner should remember"],
  "followUps": ["2-3 helpful follow-up questions"]
}

Lesson context:
${truncate(lessonContext)}

Learner question:
${finalQuestion}`,
                        },
                    ],
                },
            ]);

            setAnswer(parseTutorResponse(response));
            setQuestion('');
        } catch (error) {
            console.error('Chapter tutor failed:', error);
            toast.error('The AI tutor could not answer right now. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void askTutor();
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    type="button"
                    className="fixed bottom-20 right-4 z-40 h-12 rounded-full px-4 shadow-xl sm:bottom-6 sm:right-6"
                >
                    <Sparkles className="size-4" />
                    Ask AI
                </Button>
            </SheetTrigger>

            <SheetContent className="w-[92vw] overflow-y-auto p-0 sm:max-w-md">
                <SheetHeader className="border-b p-5">
                    <div className="flex items-start gap-3 pr-8">
                        <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-500">
                            <Sparkles className="size-5" />
                        </div>
                        <div>
                            <SheetTitle>Ask AI about this lesson</SheetTitle>
                            <SheetDescription>
                                Get a simpler explanation for lesson {lessonIndex + 1}.
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="space-y-4 p-5">
                    <CardDescription className="rounded-lg border bg-muted/30 p-3">
                        {content.topic || chapterTitle}
                    </CardDescription>

                    <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((item) => (
                            <Button
                                key={item}
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={loading}
                                onClick={() => void askTutor(item)}
                                className="h-auto max-w-full whitespace-normal text-left leading-5"
                            >
                                {item}
                            </Button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Textarea
                            value={question}
                            onChange={(event) => setQuestion(event.target.value)}
                            disabled={loading}
                            placeholder="Ask what you did not understand..."
                            className="min-h-24 resize-none bg-background"
                        />
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? (
                                <>
                                    <Loader className="size-4 animate-spin" />
                                    Thinking...
                                </>
                            ) : (
                                <>
                                    <Send className="size-4" />
                                    Ask AI Tutor
                                </>
                            )}
                        </Button>
                    </form>

                    {answer?.answer && (
                        <div className="space-y-4 overflow-hidden rounded-lg border bg-background/85 p-4">
                            <div className="flex items-center gap-2 font-medium">
                                <BookOpenCheck className="size-4 text-cyan-500" />
                                Tutor answer
                            </div>
                            <div className="space-y-3 break-words text-sm leading-6 text-muted-foreground">
                                {answer.answer.split(/\n{2,}/).map((paragraph) => (
                                    <p key={paragraph}>{formatParagraph(paragraph)}</p>
                                ))}
                            </div>

                            {Boolean(answer.keyPoints?.length) && (
                                <div>
                                    <p className="text-sm font-medium">Key points</p>
                                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                                        {answer.keyPoints?.map((point) => (
                                            <li key={point} className="break-words">
                                                {formatParagraph(point)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {Boolean(answer.followUps?.length) && (
                                <div className="min-w-0">
                                    <p className="text-sm font-medium">Try asking next</p>
                                    <div className="mt-2 grid min-w-0 gap-2">
                                        {answer.followUps?.map((item) => (
                                            <Button
                                                key={item}
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                disabled={loading}
                                                onClick={() => void askTutor(item)}
                                                className="h-auto w-full min-w-0 justify-start whitespace-normal break-words text-left leading-5"
                                            >
                                                <span className="min-w-0 break-words">
                                                    {formatParagraph(item)}
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ChapterAiTutor;
