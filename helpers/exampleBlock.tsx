import { Copy, CopyCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ExampleBlock({ text }: { text: string }) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Copied to clipboard');

            setTimeout(() => setCopied(false), 2000); // reset icon
        } catch {
            toast.error('Failed to copy');
        }
    };

    return (
        <div className="mt-4">
            <h4 className="text-lg font-semibold">Example:</h4>

            <div className="relative border-t border-muted-foreground/20 bg-muted p-3.5 pt-5 rounded-2xl">
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-3 rounded-md cursor-pointer"
                >
                    {copied ? (
                        <CopyCheck className="w-4.5 h-4.5 text-green-500" />
                    ) : (
                        <Copy className="w-4.5 h-4.5 hover:text-primary" />
                    )}
                </button>

                <p
                    className={`text-muted-foreground transition-all ${
                        expanded ? '' : 'line-clamp-3'
                    }`}
                >
                    <span className="font-mono dark:text-gray-100 whitespace-pre-wrap">
                        {text}
                    </span>
                </p>

                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-1 cursor-pointer text-xs font-medium text-primary hover:underline"
                >
                    {expanded ? (
                        <span className="text-yellow-500">Read less</span>
                    ) : (
                        <span className="text-primary">Read more</span>
                    )}
                </button>
            </div>
        </div>
    );
}
