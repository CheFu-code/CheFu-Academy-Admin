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
        hash |= 0; // Convert to 32-bit integer
    }
    // base36 for compactness, ensure positive
    return Math.abs(hash).toString(36);
}

/**
 * Parses a paragraph and returns React nodes where:
 * - Text inside single quotes '...' is wrapped in <strong>.
 * - Text inside backticks `...` is wrapped in <code> with a unique data-uid and class "unique".
 *
 * Notes:
 * - This supports multiple occurrences.
 * - Single quotes and backticks are treated as **inline delimiters**; no nesting resolution is attempted.
 * - If you need to render literal quotes/backticks, escape them in the source (e.g., \', \`).
 */
export function formatParagraph(paragraph: string): React.ReactNode[] {
    if (!paragraph) return [];

    // We will scan the string and break into tokens while respecting delimiters.
    // Delimiters we care about: ' (single quote), ` (backtick)
    // Strategy:
    //   Iterate character by character, track current mode: normal | bold | code
    //   Push nodes on transitions or at the end.

    const nodes: React.ReactNode[] = [];
    let buf = '';
    type Mode = 'normal' | 'bold' | 'code';
    let mode: Mode = 'normal';

    const flush = () => {
        if (!buf) return;
        if (mode === 'normal') {
            nodes.push(buf);
        } else if (mode === 'bold') {
            nodes.push(<strong key={`b-${nodes.length}`}>{buf}</strong>);
        } else {
            // code mode
            const uid = hashString(buf);
            nodes.push(
                <code
                    key={`c-${nodes.length}`}
                    className="unique"
                    data-uid={uid}
                >
                    {buf}
                </code>,
            );
        }
        buf = '';
    };

    const s = paragraph;
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];

        // Handle escapes for \' and \`
        if (
            ch === '\\' &&
            i + 1 < s.length &&
            (s[i + 1] === "'" || s[i + 1] === '`')
        ) {
            buf += s[i + 1];
            i++;
            continue;
        }

        if (ch === "'" && mode !== 'code') {
            // toggle bold
            if (mode === 'bold') {
                // closing bold
                flush();
                mode = 'normal';
            } else if (mode === 'normal') {
                // opening bold
                flush();
                mode = 'bold';
            } else {
                // should not happen: only normal/code/bold
            }
            continue;
        }

        if (ch === '`' && mode !== 'bold') {
            // toggle code
            if (mode === 'code') {
                // closing code
                flush();
                mode = 'normal';
            } else if (mode === 'normal') {
                // opening code
                flush();
                mode = 'code';
            }
            continue;
        }

        buf += ch;
    }

    // Flush remaining buffer
    flush();

    return nodes;
}
