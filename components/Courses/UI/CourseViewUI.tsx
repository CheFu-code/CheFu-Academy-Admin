import CourseBanner from '@/components/Shared/CourseBanner';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Course } from '@/types/course';
import { formatParagraph } from '@/utils/formatParagraph';
import { BookOpen, CheckCircle2 } from 'lucide-react';

const CourseViewUI = ({
    course,
    completedChapters,
    totalChapters,
    progress,
    handleChapterClick,
    completedChaptersState,
    router,
}: {
    course: Course;
    completedChapters: number;
    totalChapters: number;
    progress: number;
    handleChapterClick: (idx: number) => Promise<void>;
    completedChaptersState: string[];
    router: ReturnType<typeof import('next/navigation').useRouter>;
}) => {
    return (
        <div className="mx-auto max-w-5xl space-y-7 p-4">
            {course.banner_image && (
                <CourseBanner
                    banner_image={course.banner_image}
                    courseTitle={course.courseTitle}
                    category={course.category}
                    course={course}
                    router={router}
                />
            )}

            <div className="space-y-3">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {course.courseTitle}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen size={17} />
                    <p>
                        {course.chapters.length} chapter
                        {course.chapters.length === 1 ? '' : 's'}
                    </p>
                </div>
                <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
                    {course.description}
                </p>
            </div>

            {/* Progress */}
            <Card className="border-border/60 py-2 shadow-sm">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-lg">Learning Progress</CardTitle>
                    <CardDescription>
                        {completedChapters}/{totalChapters} chapters completed
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Progress value={progress} className="h-2 rounded-full" />
                    <p className="text-xs text-muted-foreground">
                        {Math.round(progress)}% complete
                    </p>
                </CardContent>
            </Card>

            {/* Chapters List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Chapters</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {course.chapters.map((chapter, idx) => {
                        const isCompleted = completedChaptersState.includes(
                            idx.toString(),
                        );

                        return (
                            <Card
                                key={idx}
                                onClick={() => handleChapterClick(idx)}
                                className={`group flex h-full cursor-pointer flex-col border-border/60 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md ${
                                    isCompleted
                                        ? 'border-green-500/80 bg-green-500/5'
                                        : ''
                                }`}
                            >
                                <div className="mb-3 flex items-start justify-between gap-2">
                                    <CardTitle className="text-sm sm:text-base">
                                        {idx + 1}. {chapter.chapterName}
                                    </CardTitle>
                                    {isCompleted && (
                                        <Badge
                                            variant="secondary"
                                            className="shrink-0 bg-green-600 text-white"
                                        >
                                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                            Completed
                                        </Badge>
                                    )}
                                </div>

                                <CardDescription className="mt-auto line-clamp-3 text-xs text-muted-foreground">
                                    {formatParagraph(chapter.content[0]?.explain as string)}
                                </CardDescription>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CourseViewUI;
