'use client';

import CourseLearningUI from '@/app/courses/_components/CourseLearningUI';
import NoChapter from '@/components/Courses/noChapter';
import NoCourse from '@/components/Courses/noCourse';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useScrollIntoView } from '@/hooks/useScrollIntoView';
import { db } from '@/lib/firebase';
import { Course } from '@/types/course';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import hljs from 'highlight.js';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

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

    const content = chapter.content[contentIndex];
    const code = content.code || '';
    const cleanCode = code
        ? code.replace(/^```[\w]*\n/, '').replace(/```$/, '')
        : '';
    const detectedLanguage = hljs.highlightAuto(code).language || 'javascript';


    const handleDownloadChapter = () => {
        if (!chapter) return;
    
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });
    
        let y = 20;
    
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginX = 20;
        const maxWidth = pageWidth - marginX * 2;
    
        // ---------- Title ----------
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(chapter.chapterName, pageWidth / 2, y, {
            align: 'center',
        });
    
        y += 15;
    
        // Divider
        doc.setDrawColor(200);
        doc.line(marginX, y, pageWidth - marginX, y);
        y += 10;
    
        // ---------- Lessons ----------
        chapter.content.forEach((item, index) => {
            // New page safety
            if (y > 260) {
                doc.addPage();
                y = 20;
            }
    
            // Lesson header
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text(`Lesson ${index + 1}`, marginX, y);
            y += 8;
    
            // Topic
            if (item.topic) {
                doc.setFontSize(12);
                doc.text(item.topic, marginX, y);
                y += 7;
            }
    
            // Explanation
            if (item.explain) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);
                const lines = doc.splitTextToSize(item.explain, maxWidth);
                doc.text(lines, marginX, y);
                y += lines.length * 6 + 5;
            }
    
            // Code block
            if (item.code) {
                const clean = item.code
                    .replace(/^```[\w]*\n/, '')
                    .replace(/```$/, '');
    
                doc.setFont('courier', 'normal');
                doc.setFontSize(10);
    
                const codeLines = doc.splitTextToSize(clean, maxWidth - 4);
    
                // Code background
                doc.setFillColor(245, 245, 245);
                doc.rect(marginX - 2, y - 5, maxWidth + 4, codeLines.length * 5 + 6, 'F');
    
                doc.text(codeLines, marginX, y);
                y += codeLines.length * 5 + 10;
            }
    
            // Example
            if (item.example) {
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(11);
                const exampleLines = doc.splitTextToSize(
                    `Example:\n${item.example}`,
                    maxWidth
                );
                doc.text(exampleLines, marginX, y);
                y += exampleLines.length * 6 + 8;
            }
        });
    
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
