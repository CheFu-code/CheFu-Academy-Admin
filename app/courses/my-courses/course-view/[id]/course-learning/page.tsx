'use client';

import CourseLearningUI from '@/app/courses/_components/CourseLearningUI';
import NoChapter from '@/components/Courses/noChapter';
import NoCourse from '@/components/Courses/noCourse';
import { getBlurredLogoDataUrl } from '@/helpers/downloadChapter';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useScrollIntoView } from '@/hooks/useScrollIntoView';
import { db } from '@/lib/firebase';
import { Course } from '@/types/course';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import hljs from 'highlight.js';
import jsPDF from 'jspdf';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const CourseLearning = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = params.id;
    const initialChapterIndex = Number(searchParams.get('chapter') || 0);

    const { user } = useAuthUser();
    const { ref: scrollRef, scroll } = useScrollIntoView<HTMLDivElement>();
    const [course, setCourse] = useState<Course | null>(null);
    const [chapterIndex] = useState(initialChapterIndex);
    const [contentIndex, setContentIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            scroll();
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, [scroll]);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            const docRef = doc(db, 'course', courseId as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
            } else {
                console.error('Course not found:', courseId);
            }
        };
        fetchCourse();
    }, [courseId]);

    useEffect(() => {
        if (!user || loading) return;
        if (course?.createdBy !== user.email) {
            toast.error('You are not authorized to view this course!');
            router.replace('/courses');
        }
    }, [course, user, router, loading]);

    if (!course) return <NoCourse />;

    const chapter = course.chapters[chapterIndex];
    if (!chapter) return <NoChapter />;

    const totalContents = chapter.content.length;
    const progressPercent = (contentIndex + 1) / totalContents;
    const content = chapter.content[contentIndex];
    const code = content.code || '';
    const detectedLanguage = hljs.highlightAuto(code).language || 'javascript';
    const cleanCode = code
        ? code.replace(/^```[\w]*\n/, '').replace(/```$/, '')
        : '';

    const handleNext = () => {
        if (contentIndex + 1 < totalContents) {
            setContentIndex(contentIndex + 1);
        }
    };

    const handleFinish = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const courseRef = doc(db, 'course', course.id);
            await updateDoc(courseRef, {
                completedChapter: arrayUnion(chapterIndex.toString()),
            });
            toast.success('Chapter completed...');
            router.replace(`/courses/my-courses/course-view/${course.id}`);
        } catch (err) {
            console.error(err);
            toast.error('Error completing chapter!');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadChapter = async () => {
        if (!chapter) return;

        const logoDataUrl = await getBlurredLogoDataUrl(); // get Base64 logo

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const marginX = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const maxWidth = pageWidth - marginX * 2;

        // ---------- COVER PAGE ----------
        let y = 60;

        // Course Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(30);
        const titleLines = doc.splitTextToSize(
            course?.courseTitle || 'Course Title',
            maxWidth,
        );
        titleLines.forEach((line: string) => {
            doc.text(line, pageWidth / 2, y, { align: 'center' });
            y += 16;
        });

        y += 15;

        // Chapter Name
        doc.setFontSize(24);
        const chapterLines = doc.splitTextToSize(chapter.chapterName, maxWidth);
        chapterLines.forEach((line: string) => {
            doc.text(line, pageWidth / 2, y, { align: 'center' });
            y += 14;
        });

        y += 20;

        // Author & Logo Placeholder
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(16);
        doc.text('Author: CheFu Academy', pageWidth / 2, y, {
            align: 'center',
        });

        // ---------- CONTENT PAGES ----------
        doc.addPage();
        y = 25;

        chapter.content.forEach((item, index) => {
            if (y > 260) {
                doc.addPage();
                y = 25;
            }

            // Lesson Header
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(15);
            doc.setTextColor(40, 40, 40);
            doc.text(`Lesson ${index + 1}`, marginX, y);
            y += 8;

            // Topic
            if (item.topic) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(13);
                doc.setTextColor(70, 70, 70);
                const topicLines = doc.splitTextToSize(item.topic, maxWidth);
                doc.text(topicLines, marginX, y);
                y += topicLines.length * 7 + 3;
            }

            // Explanation
            if (item.explain) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                const explainLines = doc.splitTextToSize(
                    item.explain,
                    maxWidth,
                );
                doc.text(explainLines, marginX, y);
                y += explainLines.length * 6 + 5;
            }

            // Code Block
            if (item.code) {
                const clean = item.code
                    .replace(/^```[\w]*\n/, '')
                    .replace(/```$/, '');
                doc.setFont('courier', 'normal');
                doc.setFontSize(11);

                const codeLines = doc.splitTextToSize(clean, maxWidth - 4);
                const blockHeight = codeLines.length * 5 + 6;

                doc.setFillColor(245, 245, 245); // light grey background
                doc.setDrawColor(200, 200, 200); // light border
                doc.rect(marginX - 2, y - 4, maxWidth + 4, blockHeight, 'FD'); // Fill and Draw
                doc.setTextColor(50, 50, 50);
                doc.text(codeLines, marginX, y);
                y += blockHeight + 6;
            }

            // Example
            if (item.example) {
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(12);
                doc.setTextColor(0, 60, 120);
                const exampleLines = doc.splitTextToSize(
                    `Example:\n${item.example}`,
                    maxWidth,
                );
                doc.text(exampleLines, marginX, y);
                y += exampleLines.length * 6 + 8;
            }

            // Lesson separator line
            y += 5;
            doc.setDrawColor(200);
            doc.setLineWidth(0.2);
            doc.line(marginX, y, pageWidth - marginX, y);
            y += 8;
        });

        // --- Add page numbers and logo ---
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' },
            );

            // Logo at bottom-right
            const logoWidth = 15; // mm
            const logoHeight = 15; // mm
            doc.addImage(
                logoDataUrl,
                'PNG',
                pageWidth - logoWidth - 10, // 10mm from right edge
                pageHeight - logoHeight - 10, // 10mm from bottom
                logoWidth,
                logoHeight,
            );
        }

        doc.save(`${chapter.chapterName.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <CourseLearningUI
            loading={loading}
            scrollRef={scrollRef}
            progressPercent={progressPercent}
            totalContents={totalContents}
            contentIndex={contentIndex}
            chapter={chapter}
            content={content}
            cleanCode={cleanCode}
            detectedLanguage={detectedLanguage}
            handleFinish={handleFinish}
            handleNext={handleNext}
            handleDownloadChapter={handleDownloadChapter}
        />
    );
};

export default CourseLearning;
