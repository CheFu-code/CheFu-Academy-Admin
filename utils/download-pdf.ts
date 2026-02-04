// utils/download-pdf.ts
import { Ticket } from '@/types/supportTicket';
import jsPDF from 'jspdf';

type Theme = {
    primary: string;
    text: string;
    subtleText: string;
    divider: string;
    chipBg: string;
    chipText: string;
    bg: string;
};

const lightTheme: Theme = {
    primary: '#2563EB',   // blue-600
    text: '#111827',      // gray-900
    subtleText: '#6B7280',// gray-500
    divider: '#E5E7EB',   // gray-200
    chipBg: '#EFF6FF',    // blue-50
    chipText: '#1E40AF',  // blue-800
    bg: '#FFFFFF',
};



type PdfOptions = {
    theme?: Theme;
    logoDataUrl?: string; // base64 data URL if you have a logo
    fileName?: string;
    title?: string;
};

export function downloadTicketPDF(ticket: Ticket, options: PdfOptions = {}) {
    const {
        theme = lightTheme,
        logoDataUrl,
        fileName = `${ticket.id}.pdf`,
        title = 'Support Ticket',
    } = options;

    const doc = new jsPDF({
        unit: 'pt', // easier control (pt)
        format: 'a4',
        compress: true,
    });

    // Layout constants
    const margin = 48; // 0.67in
    const contentWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = doc.internal.pageSize.getHeight();

    // Helpers
    const addPageNumberFooter = () => {
        const internalWithPager = doc as unknown as { internal: { getNumberOfPages: () => number } };
        const pageCount = internalWithPager.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(theme.subtleText);
            const text = `Page ${i} of ${pageCount}`;
            const textWidth = doc.getTextWidth(text);
            doc.text(text, doc.internal.pageSize.getWidth() - margin - textWidth, pageHeight - margin / 2);
        }
    };

    const drawDivider = (y: number) => {
        doc.setDrawColor(theme.divider);
        doc.setLineWidth(1);
        doc.line(margin, y, margin + contentWidth, y);
    };

    const drawChip = (text: string, x: number, y: number) => {
        const padX = 8;
        doc.setFontSize(10);
        doc.setTextColor(theme.chipText);
        doc.setFillColor(theme.chipBg);
        const w = doc.getTextWidth(text) + padX * 2;
        const h = 18;
        doc.roundedRect(x, y - h + 4, w, h, 4, 4, 'F');
        doc.text(text, x + padX, y);
        return w; // width of chip to chain them
    };

    const drawLabelValue = (
        label: string,
        value: string | number | null | undefined,
        x: number,
        y: number,
        width: number,
    ) => {
        const safe = (v: string | number | null | undefined) => (v === null || v === undefined || v === '' ? '—' : String(v));
        const labelSize = 10;
        const valueSize = 12;

        // Label
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(labelSize);
        doc.setTextColor(theme.subtleText);
        doc.text(label.toUpperCase(), x, y);

        // Value
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(valueSize);
        doc.setTextColor(theme.text);

        const wrapped = doc.splitTextToSize(safe(value), width);
        const lineHeight = 16;
        const valueY = y + 14;
        doc.text(wrapped, x, valueY);

        return valueY + (wrapped.length - 1) * lineHeight + 8; // next Y
    };

    const ensureSpace = (y: number, needed: number) => {
        if (y + needed > pageHeight - margin) {
            doc.addPage();
            return margin;
        }
        return y;
    };

    // Background (for dark theme or subtle tinting)
    if (theme.bg !== '#FFFFFF') {
        doc.setFillColor(theme.bg);
        doc.rect(0, 0, doc.internal.pageSize.getWidth(), pageHeight, 'F');
    }

    // Header
    let y = margin;
    const headerHeight = 72;
    const logoSize = 40;

    // Logo (optional)
    if (logoDataUrl) {
        try {
            doc.addImage(logoDataUrl, 'PNG', margin, y - 8, logoSize, logoSize, '', 'FAST');
        } catch {
            // If image fails, skip gracefully
        }
    }

    // Title + date
    const titleX = logoDataUrl ? margin + logoSize + 12 : margin;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(theme.text);
    doc.text(title, titleX, y + 8);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(theme.subtleText);
    const now = new Date();
    const dateStr = now.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
    doc.text(`Generated: ${dateStr}`, titleX, y + 28);

    // Chips: Status & Priority (to the right)
    const rightX = margin + contentWidth;
    const chipY = y + 8;
    const chipsStartX = rightX - 200; // reserve space for chips
    let chipX = chipsStartX;

    chipX += drawChip(`Status: ${ticket.status}`, chipX, chipY);
    chipX += 8;
    drawChip(`Priority: ${ticket.priority}`, chipX, chipY);

    y += headerHeight - 10;
    drawDivider(y);
    y += 18;

    // Ticket Summary Grid
    const colGap = 24;
    const colWidth = (contentWidth - colGap) / 2;

    // Left column: Ticket ID, Title
    let leftY = y;
    leftY = drawLabelValue('Ticket ID', ticket.id, margin, leftY, colWidth);
    leftY = drawLabelValue('Title', ticket.title, margin, leftY, colWidth);

    // Right column: User, Assigned (if present), Created/Updated (if you have these)
    let rightY = y;
    rightY = drawLabelValue('User', (ticket as Ticket).userName || '—', margin + colWidth + colGap, rightY, colWidth);

    // Optional fields (uncomment if your Ticket type has them)
    // rightY = drawLabelValue('Assigned To', (ticket as any).assignee || '—', margin + colWidth + colGap, rightY, colWidth);
    // rightY = drawLabelValue('Created At', (ticket as any).createdAt || '—', margin + colWidth + colGap, rightY, colWidth);
    // rightY = drawLabelValue('Updated At', (ticket as any).updatedAt || '—', margin + colWidth + colGap, rightY, colWidth);

    y = Math.max(leftY, rightY) + 8;
    y = ensureSpace(y, 32);
    drawDivider(y);
    y += 24;

    // Message Section
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(theme.text);
    doc.text('Message', margin, y);
    y += 12;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(theme.text);

    const msg = ticket.message || '—';
    const lineHeight = 18;
    const lines = doc.splitTextToSize(msg, contentWidth);

    for (let i = 0; i < lines.length; i++) {
        y = ensureSpace(y, lineHeight);
        doc.text(lines[i], margin, y);
        y += lineHeight;
    }

    y += 8;
    y = ensureSpace(y, 32);
    drawDivider(y);
    y += 20;

    // Footer note (optional)
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(theme.subtleText);
    doc.text('This document was generated automatically from the support system.', margin, y);

    // Page numbers
    addPageNumberFooter();

    doc.save(fileName);
}
