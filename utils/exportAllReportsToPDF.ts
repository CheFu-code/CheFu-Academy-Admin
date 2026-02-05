// utils/exportAllReportsToPDF.ts
import type { Report } from '@/types/reports';

export const exportAllReportsToPDF = async (
    reports: Report[],
    options?: {
        fileName?: string;
        title?: string;
        subtitle?: string;
        logoUrl?: string; // optional brand logo (URL or base64)
    }
) => {
    if (!reports?.length) return;

    // Lazy-load to reduce initial bundle size
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
    ]);

    const doc = new jsPDF({
        orientation: 'landscape', // better for wide tables
        unit: 'pt',
        format: 'a4',
    });
    autoTable(doc, {
        head: [['ID', 'Title', 'Author']],
        body: [['1', 'Course 1', 'CheFu']],
    });
    doc.save('report.pdf');

const now=new Date();

    const formattedDate = now.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

    const title = options?.title ?? 'All Reports';
    const subtitle =
        options?.subtitle ?? `Exported on ${formattedDate}`;
    const fileName = (options?.fileName ?? 'reports.pdf').replace(/[/\\?%*:|"<>]/g, '-');

    // --- Header (logo + title) ---
    const pageWidth = doc.internal.pageSize.getWidth();
    const y = 40;
    const leftMargin = 40;
    const rightMargin = 40;

    // Optional: Logo rendering (best to provide base64/png for reliability)
    if (options?.logoUrl) {
        try {
            // If it's a URL, we fetch and convert to data URL
            const asDataUrl = await fetchImageAsDataURL(options.logoUrl);
            doc.addImage(asDataUrl, 'PNG', leftMargin, y - 10, 48, 48);
        } catch {
            // fail silently if logo fails to load
        }
    }

    // Title & subtitle
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(title, leftMargin + (options?.logoUrl ? 60 : 0), y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.setFontSize(11);
    doc.text(subtitle, leftMargin + (options?.logoUrl ? 60 : 0), y + 26);

    // A soft divider line
    doc.setDrawColor(230);
    doc.setLineWidth(1);
    doc.line(leftMargin, y + 40, pageWidth - rightMargin, y + 40);

    // --- Table data ---
    const head = [['ID', 'Title', 'Reported By', 'Reason', 'Reported At']];
    const body = reports.map((r) => [
        r.id,
        r.title,
        r.reportedBy,
        r.reason,
        r.reportedAt,
    ]);

    // --- Table styles with autoTable ---
    autoTable(doc, {
        head,
        body,
        startY: y + 56,
        styles: {
            font: 'helvetica',
            fontSize: 10,
            textColor: [45, 45, 45],
            cellPadding: 8,
            lineColor: [235, 235, 235],
            lineWidth: 0.75,
            overflow: 'linebreak',
        },
        headStyles: {
            fillColor: [245, 246, 250],
            textColor: [33, 33, 33],
            lineWidth: 1,
            lineColor: [220, 220, 220],
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250],
        },
        columnStyles: {
            0: { cellWidth: 130 }, // ID
            1: { cellWidth: 220 }, // Title
            2: { cellWidth: 160 }, // Reported By
            3: { cellWidth: 320 }, // Reason
            4: { cellWidth: 140 }, // Reported At
        },
        didDrawPage: () => {
            // Footer with page numbers
            const pageCount = doc.getNumberOfPages();
            const pageSize = doc.internal.pageSize;
            const footerY = pageSize.getHeight() - 24;

            doc.setFontSize(10);
            doc.setTextColor(120);
            const pageLabel = `Page ${doc.getCurrentPageInfo().pageNumber} of ${pageCount}`;
            doc.text(pageLabel, pageSize.getWidth() - rightMargin, footerY, { align: 'right' });
        },
        margin: { top: 40, bottom: 40, left: leftMargin, right: rightMargin },
    });

    doc.save(fileName);
};

// Helper: fetch image URL to base64 DataURL (for logo)
async function fetchImageAsDataURL(url: string): Promise<string> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}