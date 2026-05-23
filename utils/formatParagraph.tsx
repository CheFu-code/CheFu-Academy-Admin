// utils/formatParagraph.tsx
import React from 'react';

/**
 * Create a stable short hash for a string (for data-uid).
 * Not cryptographically secure; just for stable IDs in the UI.
 */
function hashString(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(36);
}

type MarkdownToken = {
    delimiter: string;
    type: 'bold' | 'italic' | 'code';
};

const markdownTokens: MarkdownToken[] = [
    { delimiter: '**', type: 'bold' },
    { delimiter: '__', type: 'bold' },
    { delimiter: '`', type: 'code' },
    { delimiter: '*', type: 'italic' },
    { delimiter: '_', type: 'italic' },
];

const findTokenAt = (value: string, index: number) =>
    markdownTokens.find(({ delimiter }) => value.startsWith(delimiter, index));

const isEscaped = (value: string, index: number) => {
    let slashCount = 0;
    for (let i = index - 1; i >= 0 && value[i] === '\\'; i--) {
        slashCount++;
    }
    return slashCount % 2 === 1;
};

const hasClosingDelimiter = (
    value: string,
    delimiter: string,
    startIndex: number,
) => {
    for (let i = startIndex; i < value.length; i++) {
        if (!isEscaped(value, i) && value.startsWith(delimiter, i)) {
            return true;
        }
    }
    return false;
};

/**
 * Render a small, safe subset of inline Markdown.
 *
 * Supported:
 * - **bold** and __bold__
 * - *italic* and _italic_
 * - `inline code`
 * - escaped delimiters such as \*\* or \`
 *
 * Important: apostrophes/single quotes are treated as normal text, so phrases
 * like "Newton's First Law" are not accidentally bolded.
 */
export function formatParagraph(paragraph: string): React.ReactNode[] {
    if (!paragraph) return [];

    const nodes: React.ReactNode[] = [];
    let buffer = '';
    let activeToken: MarkdownToken | null = null;

    const flush = () => {
        if (!buffer) return;

        if (!activeToken) {
            nodes.push(buffer);
        } else if (activeToken.type === 'bold') {
            nodes.push(<strong key={`b-${nodes.length}`}>{buffer}</strong>);
        } else if (activeToken.type === 'italic') {
            nodes.push(<em key={`i-${nodes.length}`}>{buffer}</em>);
        } else {
            nodes.push(
                <code
                    key={`c-${nodes.length}`}
                    className="unique"
                    data-uid={hashString(buffer)}
                >
                    {buffer}
                </code>,
            );
        }

        buffer = '';
    };

    for (let i = 0; i < paragraph.length; i++) {
        if (paragraph[i] === '\\' && i + 1 < paragraph.length) {
            buffer += paragraph[i + 1];
            i++;
            continue;
        }

        if (activeToken) {
            if (paragraph.startsWith(activeToken.delimiter, i)) {
                flush();
                i += activeToken.delimiter.length - 1;
                activeToken = null;
                continue;
            }

            buffer += paragraph[i];
            continue;
        }

        const token = findTokenAt(paragraph, i);
        if (
            token &&
            hasClosingDelimiter(
                paragraph,
                token.delimiter,
                i + token.delimiter.length,
            )
        ) {
            flush();
            activeToken = token;
            i += token.delimiter.length - 1;
            continue;
        }

        buffer += paragraph[i];
    }

    if (activeToken) {
        buffer = `${activeToken.delimiter}${buffer}`;
    }
    flush();

    return nodes;
}
