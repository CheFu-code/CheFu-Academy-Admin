import { useEffect, useRef, useState } from 'react';
import { formatParagraph } from '@/utils/formatParagraph';

export default function ExplainText({ text }: { text: string }) {
    const [expanded, setExpanded] = useState(false);
    const [canExpand, setCanExpand] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        setExpanded(false);
    }, [text]);

    useEffect(() => {
        const element = textRef.current;
        if (!element) return;

        const updateCanExpand = () => {
            if (expanded) {
                setCanExpand(true);
                return;
            }
            setCanExpand(element.scrollHeight > element.clientHeight + 1);
        };

        updateCanExpand();

        const resizeObserver = new ResizeObserver(updateCanExpand);
        resizeObserver.observe(element);

        return () => resizeObserver.disconnect();
    }, [expanded, text]);

    return (
        <div>
            <p
                ref={textRef}
                className={`text-muted-foreground transition-all ${
                    expanded ? '' : 'line-clamp-5'
                }`}
            >
                {formatParagraph(text)}
            </p>

            {canExpand && (
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
            )}
        </div>
    );
}
