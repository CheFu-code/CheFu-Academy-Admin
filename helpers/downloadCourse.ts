// utils/downloadCoursePDF_Office.ts
import { jsPDF } from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import QRCode from 'qrcode';
import type { Course } from '@/types/course';

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

/** Image URL -> data URL (CORS-safe where allowed). */
const toDataURL = (src?: string): Promise<string | undefined> => {
    if (!src) return Promise.resolve(undefined);
    if (src.startsWith('data:')) return Promise.resolve(src);

    return new Promise((resolve) => {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return resolve(undefined);
                    ctx.drawImage(img, 0, 0);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
                    resolve(dataUrl);
                } catch {
                    resolve(undefined);
                }
            };
            img.onerror = () => resolve(undefined);
            img.src = src;
        } catch {
            resolve(undefined);
        }
    });
};

type FontSize = 9 | 10 | 11 | 12 | 14 | 18 | 20;

/* -------------------------------------------------------------------------- */
/* VS Code Dark+ tokenization (lightweight, JS/TS-friendly)                   */
/* -------------------------------------------------------------------------- */

const VSCodeDark = {
    bg: [30, 30, 30] as [number, number, number],        // #1e1e1e
    border: [60, 60, 60] as [number, number, number],    // #3c3c3c
    default: [212, 212, 212] as [number, number, number],// #d4d4d4
    keyword: [197, 134, 192] as [number, number, number],// #c586c0
    string: [206, 145, 120] as [number, number, number], // #ce9178
    number: [181, 206, 168] as [number, number, number], // #b5cea8
    comment: [106, 153, 85] as [number, number, number], // #6a9955
    func: [220, 220, 170] as [number, number, number],   // #dcdcaa
    type: [78, 201, 176] as [number, number, number],    // #4ec9b0
};

const JS_KEYWORDS = new Set([
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export',
    'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'return', 'super',
    'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'as', 'async', 'await',
    'enum', 'interface', 'implements', 'private', 'protected', 'public', 'readonly', 'static', 'of'
]);

type Token = { text: string; color: [number, number, number] };

/** Tokenize a line with basic states to emulate VS Code Dark+ look. */
function tokenizeLineVSCode(line: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    // Very light stateful parsing
    const push = (text: string, color: [number, number, number]) => {
        if (!text) return;
        tokens.push({ text, color });
    };

    // handle block comments /* ... */ (single-line support)
    const blkStart = line.indexOf('/*');
    const blkEnd = blkStart >= 0 ? line.indexOf('*/', blkStart + 2) : -1;
    if (blkStart >= 0 && blkEnd > blkStart) {
        // split pre, comment, post
        const pre = line.slice(0, blkStart);
        const mid = line.slice(blkStart, blkEnd + 2);
        const post = line.slice(blkEnd + 2);
        return [
            ...tokenizeLineVSCode(pre),
            { text: mid, color: VSCodeDark.comment },
            ...tokenizeLineVSCode(post),
        ];
    }

    // handle line comment //
    const slc = line.indexOf('//');
    if (slc >= 0) {
        const before = line.slice(0, slc);
        const after = line.slice(slc);
        return [...tokenizeLineVSCode(before), { text: after, color: VSCodeDark.comment }];
    }

    // main scan for strings / keywords / numbers / functions / types
    while (i < line.length) {
        const ch = line[i];

        // strings
        if (ch === '"' || ch === "'" || ch === '`') {
            const quote = ch;
            let j = i + 1;
            let escaped = false;
            while (j < line.length) {
                const cj = line[j];
                if (!escaped && cj === quote) {
                    j++;
                    break;
                }
                escaped = !escaped && cj === '\\';
                j++;
            }
            push(line.slice(i, j), VSCodeDark.string);
            i = j;
            continue;
        }

        // numbers
        if (/\d/.test(ch) && (i === 0 || /[^\w]/.test(line[i - 1]))) {
            let j = i + 1;
            while (j < line.length && /[\d._xobA-Fa-f]/.test(line[j])) j++;
            push(line.slice(i, j), VSCodeDark.number);
            i = j;
            continue;
        }

        // identifiers / keywords / function / types
        if (/[A-Za-z_$]/.test(ch)) {
            let j = i + 1;
            while (j < line.length && /[\w$]/.test(line[j])) j++;
            const id = line.slice(i, j);

            // function if next non-space is '('
            let k = j;
            while (k < line.length && /\s/.test(line[k])) k++;
            if (line[k] === '(') {
                push(id, VSCodeDark.func);
                i = j;
                continue;
            }

            // Type-ish (PascalCase) heuristic
            if (/^[A-Z][A-Za-z0-9_]*$/.test(id)) {
                push(id, VSCodeDark.type);
                i = j;
                continue;
            }

            // keyword
            if (JS_KEYWORDS.has(id)) {
                push(id, VSCodeDark.keyword);
                i = j;
                continue;
            }

            // default identifier
            push(id, VSCodeDark.default);
            i = j;
            continue;
        }

        // default single char
        push(ch, VSCodeDark.default);
        i++;
    }

    return tokens;
}

/** Measure & draw VS Code Dark+ block with safe wrapping and background box. */
function measureHighlightedBlockHeight(
    doc: jsPDF,
    code: string,
    options: { fontSize: number; contentWidth: number; padX: number; padY: number; lineStep: number }
): number {
    const { fontSize, contentWidth, padX, padY, lineStep } = options;

    // Prepare font for measuring
    doc.setFont('courier', 'normal');
    doc.setFontSize(fontSize);

    const maxLineWidth = contentWidth - padX * 2;
    let linesCount = 0;

    const drawWidth = (text: string) => doc.getTextWidth(text);

    code.split('\n').forEach((line) => {
        const tokens = tokenizeLineVSCode(line);
        let currentWidth = 0;
        // iterate tokens and wrap by measured width
        tokens.forEach((t) => {
            const parts = t.text.split(/(\s+)/); // preserve spaces
            parts.forEach((p) => {
                const w = drawWidth(p);
                if (currentWidth + w > maxLineWidth && currentWidth > 0) {
                    // wrap
                    linesCount++;
                    currentWidth = 0;
                }
                currentWidth += w;
            });
        });
        // Count last line (even if empty)
        linesCount++;
    });

    return padY * 2 + linesCount * lineStep;
}

function drawHighlightedCodeBlock(
    doc: jsPDF,
    code: string,
    x: number,
    y: number,
    width: number,
    options?: Partial<{ fontSize: number; padX: number; padY: number; lineStep: number }>
): number {
    const fontSize = options?.fontSize ?? 10;
    const padX = options?.padX ?? 3;
    const padY = options?.padY ?? 3;
    const lineStep = options?.lineStep ?? (fontSize + 3);
    const contentWidth = width;

    const blockHeight = measureHighlightedBlockHeight(doc, code, {
        fontSize, contentWidth, padX, padY, lineStep,
    });

    // Background
    doc.setFillColor(...VSCodeDark.bg);
    doc.setDrawColor(...VSCodeDark.border);
    doc.roundedRect(x, y, contentWidth, blockHeight, 1.5, 1.5, 'FD');

    // Text drawing
    doc.setFont('courier', 'normal');
    doc.setFontSize(fontSize);

    const innerX = x + padX;
    let drawY = y + padY + (lineStep - fontSize) / 2 + fontSize * 0.75; // baseline adjust
    const maxLineWidth = contentWidth - padX * 2;

    const drawWidth = (text: string) => doc.getTextWidth(text);

    code.split('\n').forEach((line) => {
        const tokens = tokenizeLineVSCode(line);
        let cursorX = innerX;

        tokens.forEach((t) => {
            const parts = t.text.split(/(\s+)/);
            parts.forEach((p) => {
                if (!p) return;
                const w = drawWidth(p);
                if (cursorX + w > innerX + maxLineWidth && cursorX > innerX) {
                    // wrap to next line
                    drawY += lineStep;
                    cursorX = innerX;
                }
                doc.setTextColor(...t.color);
                doc.text(p, cursorX, drawY, { baseline: 'alphabetic' });
                cursorX += w;
            });
        });

        // move to next line
        drawY += lineStep;
    });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    return blockHeight;
}

/* -------------------------------------------------------------------------- */
/* Office-like Professional Export                                            */
/* -------------------------------------------------------------------------- */

export const downloadCoursePDF_Office = async (course: Course) => {
    if (!course) return;

    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });

    // Page geometry (Office-like)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const MARGIN = { top: 22, right: 22, bottom: 18, left: 22 };
    const HEADER_HEIGHT = 16;
    const FOOTER_HEIGHT = 12;
    const CONTENT_WIDTH = pageWidth - MARGIN.left - MARGIN.right;
    const TOP_START = MARGIN.top + HEADER_HEIGHT;
    const BOTTOM_LIMIT = pageHeight - MARGIN.bottom - FOOTER_HEIGHT;

    // Rhythm
    const LINE_STEP = 6; // baseline step
    const GAP_SM = 4;
    const GAP_MD = 6;
    const GAP_LG = 10;

    // Fluent/Office palette
    const Colors = {
        primary: [0, 120, 212] as [number, number, number], // #0078D4 (Microsoft Fluent)
        accent: [0, 153, 188] as [number, number, number],  // lighter blue
        text: [32, 32, 32] as [number, number, number],
        muted: [110, 110, 110] as [number, number, number],
        divider: [214, 214, 214] as [number, number, number],
        tableStripe: [248, 248, 248] as [number, number, number],
        codeBg: VSCodeDark.bg,
    };

    const setFont = (style: 'normal' | 'bold' | 'italic' = 'normal', size: FontSize = 12, color = Colors.text) => {
        doc.setFont('helvetica', style); // Tip: embed 'Inter' or 'Segoe UI' if available
        doc.setFontSize(size);
        doc.setTextColor(...color);
    };

    let y = TOP_START;

    // Metadata
    doc.setProperties({
        title: String(course.courseTitle || 'Course'),
        subject: String(course.category || 'Course Material'),
        author: String(course.createdBy || 'Author'),
        keywords: [
            'course',
            typeof course.category === 'string' ? course.category : '',
            'training',
            'education',
        ].filter(Boolean).join(', '),
        creator: 'CheFu Academy',
    });

    const ensureSpace = (heightNeeded: number) => {
        if (y + heightNeeded > BOTTOM_LIMIT) {
            doc.addPage();
            y = TOP_START;
        }
    };

    const divider = (spaceBefore = GAP_SM, spaceAfter = GAP_SM) => {
        ensureSpace(spaceBefore + spaceAfter + 1);
        y += spaceBefore;
        doc.setDrawColor(...Colors.divider);
        doc.setLineWidth(0.2);
        doc.line(MARGIN.left, y, pageWidth - MARGIN.right, y);
        y += spaceAfter;
    };

    const writeHeading = (text: string, level: 1 | 2 | 3 = 1, opts?: { align?: 'left' | 'center' | 'right' }) => {
        const cfg = {
            1: { size: 20 as FontSize, style: 'bold' as const, color: Colors.primary, before: 0, after: GAP_SM },
            2: { size: 14 as FontSize, style: 'bold' as const, color: Colors.text, before: GAP_LG, after: GAP_SM },
            3: { size: 12 as FontSize, style: 'bold' as const, color: Colors.text, before: GAP_MD, after: GAP_SM },
        }[level];

        const align = opts?.align ?? 'left';
        const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
        const blockHeight = lines.length * LINE_STEP + cfg.after + cfg.before;

        ensureSpace(blockHeight);
        y += cfg.before;
        setFont(cfg.style, cfg.size, cfg.color);
        if (align === 'center') {
            doc.text(lines, pageWidth / 2, y, { align: 'center' });
        } else if (align === 'right') {
            doc.text(lines, pageWidth - MARGIN.right, y, { align: 'right' });
        } else {
            doc.text(lines, MARGIN.left, y);
        }
        y += lines.length * LINE_STEP + cfg.after;
    };

    const writeBody = (text?: string, size: FontSize = 12) => {
        if (!text?.trim()) return;
        setFont('normal', size, Colors.text);
        const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
        const blockHeight = lines.length * LINE_STEP;
        ensureSpace(blockHeight);
        doc.text(lines, MARGIN.left, y);
        y += blockHeight;
    };

    const writeKVP = (label: string, value?: string) => {
        if (!value) return;
        const labelStyle: FontSize = 12;
        setFont('bold', labelStyle, Colors.text);
        const labelW = doc.getTextWidth(label);
        const lh = LINE_STEP;
        ensureSpace(lh);
        doc.text(label, MARGIN.left, y);
        setFont('normal', 12, Colors.text);
        const wrapped = doc.splitTextToSize(value, CONTENT_WIDTH - labelW - 6);
        const h = Math.max(lh, wrapped.length * LINE_STEP);
        doc.text(wrapped, MARGIN.left + labelW + 6, y);
        y += h;
    };

    const formatDate = (d?: Date | { toDate?: () => Date } | string | number) => {
        if (!d) return undefined;
        try {
            const asDate: Date = typeof (d as { toDate?: () => Date })?.toDate === 'function'
                ? (d as { toDate: () => Date }).toDate()
                : new Date(d as string | number | Date);
            return asDate.toLocaleDateString();
        } catch {
            return undefined;
        }
    };

    /* ----------------------------- Cover & Header ---------------------------- */

    // Optional banner
    const bannerDataUrl = await toDataURL(course.banner_image);
    if (bannerDataUrl) {
        const BANNER_H = 36;
        ensureSpace(BANNER_H + GAP_SM);
        try {
            doc.addImage(
                bannerDataUrl,
                bannerDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG',
                MARGIN.left, y, CONTENT_WIDTH, BANNER_H, undefined, 'FAST'
            );
            y += BANNER_H + GAP_SM;
        } catch { /* ignore */ }
    }

    // Title (wrap long titles cleanly)
    writeHeading(course.courseTitle || 'Course', 1);

    // Meta line
    const metaBits: string[] = [];
    if (course.category) metaBits.push(course.category);
    if (course.createdBy) metaBits.push(`Author: ${course.createdBy}`);
    const createdOn = formatDate(course.createdOn);
    if (createdOn) metaBits.push(`Created: ${createdOn}`);
    if (metaBits.length) {
        setFont('italic', 11, Colors.muted);
        const lines = doc.splitTextToSize(metaBits.join('  •  '), CONTENT_WIDTH);
        ensureSpace(lines.length * LINE_STEP);
        doc.text(lines, MARGIN.left, y);
        y += lines.length * LINE_STEP;
    }

    // Subtle brand band
    ensureSpace(5);
    doc.setFillColor(...Colors.primary);
    doc.rect(MARGIN.left, y, CONTENT_WIDTH, 2.2, 'F');
    y += GAP_MD;

    // Optional QR (course.url)
    let qrDataUrl: string | undefined;
    const courseUrl = (course as Course)?.id as string | undefined;
    if (courseUrl) {
        try {
            qrDataUrl = await QRCode.toDataURL(courseUrl, { margin: 0, width: 160 });
        } catch { /* ignore */ }
    }

    // Metadata table (Office-like)
    const metaRows: RowInput[] = [];
    if (course.category) metaRows.push(['Category', course.category]);
    if (course.createdBy) metaRows.push(['Author', 'CheFu Academy']);
    if (createdOn) metaRows.push(['Created', createdOn]);
    if (courseUrl) metaRows.push(['Link', courseUrl]);

    if (metaRows.length) {
        autoTable(doc, {
            startY: y,
            head: [['Field', 'Value']],
            body: metaRows,
            theme: 'grid',
            styles: { font: 'helvetica', fontSize: 10, cellPadding: 3, lineColor: Colors.divider as [number, number, number], textColor: Colors.text as [number, number, number] },
            headStyles: { fillColor: Colors.primary as [number, number, number], textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: Colors.tableStripe as [number, number, number] },
            margin: { left: MARGIN.left, right: MARGIN.right },
            tableWidth: CONTENT_WIDTH,
        });
        y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + GAP_SM;
    }

    // Place QR at top-right of current flow if room
    if (qrDataUrl && y + 28 < BOTTOM_LIMIT) {
        try {
            const qrSize = 26;
            doc.addImage(qrDataUrl, 'PNG', pageWidth - MARGIN.right - qrSize, y, qrSize, qrSize, undefined, 'FAST');
            setFont('normal', 9, Colors.muted);
            doc.text('Scan for course', pageWidth - MARGIN.right - qrSize, y + qrSize + 4);
            y += GAP_SM;
        } catch { /* ignore */ }
    }

    divider(GAP_MD, GAP_MD);

    // Description
    if (course.description) {
        writeHeading('Description', 2);
        writeBody(course.description);
    }

    /* ------------------------------- Content -------------------------------- */

    // TOC anchors
    type Anchor = { label: string; page: number; top: number };
    const toc: Anchor[] = [];
    const anchorHere = (label: string) => {
        toc.push({ label, page: doc.getCurrentPageInfo().pageNumber, top: y });
    };

    // Chapters
    if (course.chapters?.length) {
        course.chapters.forEach((ch, idx) => {
            divider(GAP_LG, GAP_MD);
            const title = `Chapter ${idx + 1}: ${ch.chapterName}`;
            writeHeading(title, 2);
            anchorHere(title);

            ch.content?.forEach((item, sIdx) => {
                const sec = `Section ${idx + 1}.${sIdx + 1}`;
                writeHeading(sec, 3);

                if (item.topic) writeKVP('Topic:', item.topic);

                if (item.explain) {
                    writeHeading('Explanation', 3);
                    writeBody(item.explain);
                }

                if (item.code) {
                    writeHeading('Code', 3);
                    // Pre-measure and page-break safe block
                    const blockH = measureHighlightedBlockHeight(doc, item.code, {
                        fontSize: 10, contentWidth: CONTENT_WIDTH, padX: 3, padY: 3, lineStep: 14
                    });
                    ensureSpace(blockH + GAP_SM);
                    const drawnH = drawHighlightedCodeBlock(
                        doc, item.code, MARGIN.left, y, CONTENT_WIDTH,
                        { fontSize: 10, padX: 3, padY: 3, lineStep: 14 }
                    );
                    y += drawnH + GAP_SM;
                }

                if (item.example) {
                    writeHeading('Example', 3);
                    writeBody(item.example);
                }
            });
        });
    }

    // Flashcards (table)
    if (course.flashcards?.length) {
        divider(GAP_LG, GAP_MD);
        writeHeading('Flashcards', 2);

        const rows: RowInput[] = course.flashcards.map((f, i) => [String(i + 1), f.front || '', f.back || '']);
        autoTable(doc, {
            startY: y,
            head: [['#', 'Question', 'Answer']],
            body: rows,
            theme: 'grid',
            styles: { font: 'helvetica', fontSize: 10, cellPadding: 3, valign: 'top' },
            headStyles: { fillColor: Colors.primary as [number, number, number], textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: Colors.tableStripe as [number, number, number] },
            margin: { left: MARGIN.left, right: MARGIN.right },
            tableWidth: CONTENT_WIDTH,
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                1: { cellWidth: (CONTENT_WIDTH - 10) * 0.48 },
                2: { cellWidth: (CONTENT_WIDTH - 10) * 0.52 },
            },
        });
        y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + GAP_SM;
    }

    // Q&A (table)
    if (course.qa?.length) {
        divider(GAP_LG, GAP_MD);
        writeHeading('Q&A', 2);

        const rows: RowInput[] = course.qa.map((qa, i) => [String(i + 1), qa.question || '', qa.answer || '']);
        autoTable(doc, {
            startY: y,
            head: [['#', 'Question', 'Answer']],
            body: rows,
            theme: 'grid',
            styles: { font: 'helvetica', fontSize: 10, cellPadding: 3, valign: 'top' },
            headStyles: { fillColor: Colors.primary as [number, number, number], textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: Colors.tableStripe as [number, number, number] },
            margin: { left: MARGIN.left, right: MARGIN.right },
            tableWidth: CONTENT_WIDTH,
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                1: { cellWidth: (CONTENT_WIDTH - 10) * 0.48 },
                2: { cellWidth: (CONTENT_WIDTH - 10) * 0.52 },
            },
        });
        y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + GAP_SM;
    }

    // Quiz (table)
    if (course.quiz?.length) {
        divider(GAP_LG, GAP_MD);
        writeHeading('Quiz', 2);

        const rows: RowInput[] = course.quiz.map((q, i) => {
            const options = (q.options || []).map((o, idx) => `${idx + 1}. ${o}`).join('\n');
            const ans = q.correctAns ? q.correctAns : '';
            return [String(i + 1), q.question || '', options, ans];
        });

        autoTable(doc, {
            startY: y,
            head: [['#', 'Question', 'Options', 'Answer']],
            body: rows,
            theme: 'grid',
            styles: { font: 'helvetica', fontSize: 10, cellPadding: 3, valign: 'top' },
            headStyles: { fillColor: Colors.primary as [number, number, number], textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: Colors.tableStripe as [number, number, number] },
            margin: { left: MARGIN.left, right: MARGIN.right },
            tableWidth: CONTENT_WIDTH,
            columnStyles: {
                0: { halign: 'center', cellWidth: 8 },
                1: { cellWidth: (CONTENT_WIDTH - 8) * 0.45 },
                2: { cellWidth: (CONTENT_WIDTH - 8) * 0.38 },
                3: { cellWidth: (CONTENT_WIDTH - 8) * 0.17 },
            },
        });
        y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + GAP_SM;
    }

    /* --------------------------------- TOC ---------------------------------- */

    if (toc.length) {
        doc.addPage();
        y = TOP_START;
        writeHeading('Contents', 2);
        setFont('normal', 11, Colors.text);

        toc.forEach((a, i) => {
            const label = `${i + 1}. ${a.label}`;
            const lines = doc.splitTextToSize(label, CONTENT_WIDTH - 12);
            const h = lines.length * LINE_STEP;
            ensureSpace(h);
            doc.text(lines, MARGIN.left, y);
            // link indicator
            doc.textWithLink(' ↗', MARGIN.left + doc.getTextWidth(lines.join(' ')) + 2, y, {
                pageNumber: a.page, top: a.top - 4
            });
            y += h;
        });
    }

    /* --------------------------- Header & Footer pass ----------------------- */

    const totalPages = doc.getNumberOfPages();

    const drawHeader = (pageNo: number) => {
        doc.setPage(pageNo);

        // divider
        doc.setDrawColor(...Colors.divider);
        doc.setLineWidth(0.2);
        doc.line(MARGIN.left, MARGIN.top - 2, pageWidth - MARGIN.right, MARGIN.top - 2);

        // date (left)
        setFont('normal', 9, Colors.muted);
        doc.text(new Date().toLocaleDateString(), MARGIN.left, MARGIN.top - 6);

        // title (right, truncated)
        const title = String(course.courseTitle || 'Course');
        let headerTitle = title;
        const maxHeaderWidth = CONTENT_WIDTH * 0.6;
        while (doc.getTextWidth(headerTitle) > maxHeaderWidth && headerTitle.length > 4) {
            headerTitle = headerTitle.slice(0, -4) + '…';
        }
        setFont('bold', 10, Colors.primary);
        doc.text(headerTitle, pageWidth - MARGIN.right, MARGIN.top - 6, { align: 'right' });
    };

    const drawFooter = (pageNo: number) => {
        doc.setPage(pageNo);

        // divider
        doc.setDrawColor(...Colors.divider);
        doc.setLineWidth(0.2);
        doc.line(
            MARGIN.left,
            pageHeight - MARGIN.bottom - FOOTER_HEIGHT + 2,
            pageWidth - MARGIN.right,
            pageHeight - MARGIN.bottom - FOOTER_HEIGHT + 2
        );

        // left text
        setFont('normal', 9, Colors.muted);
        doc.text('Generated by CheFu Academy', MARGIN.left, pageHeight - MARGIN.bottom + 2);

        // right page number
        doc.text(`Page ${pageNo} of ${totalPages}`, pageWidth - MARGIN.right, pageHeight - MARGIN.bottom + 2, {
            align: 'right',
        });
    };

    for (let p = 1; p <= totalPages; p++) {
        drawHeader(p);
        drawFooter(p);
    }

    /* --------------------------------- Save --------------------------------- */

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const rawTitle =
            typeof course.courseTitle === 'string' && course.courseTitle.trim().length
                ? course.courseTitle
                : 'course';

        const safeTitle = String(rawTitle).replace(/[\\/:*?"<>|]+/g, '_');
        const fileName = `${safeTitle}.pdf`;

        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
};
