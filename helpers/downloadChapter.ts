import { Chapter, Course } from '@/types/course';
import jsPDF from 'jspdf';


export const handleDownloadChapter = ({ chapter, course }: { chapter: Chapter, course: Course }) => {
    if (!chapter) return;

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

    // Optional: small logo placeholder
    // doc.addImage(logoDataUrl, 'PNG', pageWidth / 2 - 25, y + 10, 50, 50);

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

    // Add page numbers
    const pageCount = (doc as jsPDF).getNumberOfPages();
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
    }

    doc.save(`${chapter.chapterName.replace(/\s+/g, '_')}.pdf`);
};


export const getBlurredLogoDataUrl = async () => {
    const response = await fetch('/logo.png'); // your public folder logo
    const imgBlob = await response.blob();
    const img = new Image();
    img.src = URL.createObjectURL(imgBlob);

    return new Promise<string>((resolve) => {
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            const blurAmount = 5; // blur radius in px

            canvas.width = img.width;
            canvas.height = img.height;

            // Draw blurred image
            ctx.filter = `blur(${blurAmount}px)`;
            ctx.drawImage(img, 0, 0);

            resolve(canvas.toDataURL('image/png'));
        };
    });
};

