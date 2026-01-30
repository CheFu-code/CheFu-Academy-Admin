import { useState } from 'react';
import { formatParagraph } from '@/utils/formatParagraph';

export default function ExplainText({ text }: { text: string }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <p
                className={`text-muted-foreground transition-all ${
                    expanded ? '' : 'line-clamp-5'
                }`}
            >
                {formatParagraph(text)}
            </p>

            <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 cursor-pointer text-xs font-medium text-primary hover:underline"
            >
                {expanded ? (
                    <span className="text-yellow-500">Read less</span>
                ) : (
                    <span className="text-green-500">Read more</span>
                )}
            </button>
        </div>
    );
}
