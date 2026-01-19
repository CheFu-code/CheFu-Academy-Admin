import { useState } from 'react';

export default function ExampleBlock({ text }: { text: string }) {
    const [expanded, setExpanded] = useState(false);

    

    return (
        <div className="pt-2 mt-4 border-t border-muted-foreground/20 bg-green-900 p-2 rounded-2xl">
            <h4 className="text-lg font-semibold">Example:</h4>

            <p
                className={`text-muted-foreground transition-all ${
                    expanded ? '' : 'line-clamp-5'
                }`}
            >
                <span className="font-mono text-gray-400 whitespace-pre-wrap">
                    {text}
                </span>
            </p>

                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-1 text-sm font-medium text-primary hover:underline"
                >
                    {expanded ? 'Read less' : 'Read more'}
                </button>
        </div>
    );
}
