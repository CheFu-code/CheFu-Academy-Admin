'use client';

import { Check, Copy } from 'lucide-react';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

interface CodeHighlighterProps {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
    filename?: string;
}

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
    code,
    language = 'javascript',
    showLineNumbers = true,
    filename,
}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative mt-4 overflow-hidden rounded-lg border border-white/10 bg-[#0b0b0b]">
            {filename && (
                <div className="border-b border-white/10 px-4 py-2 text-xs font-medium text-zinc-400">
                    {filename}
                </div>
            )}
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers={showLineNumbers}
                useInlineStyles={true}
                customStyle={{
                    borderRadius: 0,
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                    overflowX: 'auto',
                    backgroundColor: '#0b0b0b',
                }}
            >
                {code}
            </SyntaxHighlighter>

            {!copied ? (
                <button
                    type="button"
                    aria-label="Copy code"
                    onClick={handleCopy}
                    className="absolute right-3 top-3 rounded-md border border-white/10 bg-black/80 p-2 text-zinc-300 transition hover:text-white"
                >
                    <Copy size={16} />
                </button>
            ) : (
                <span className="absolute right-3 top-3 rounded-md border border-emerald-400/30 bg-emerald-500/10 p-2 text-emerald-300">
                    <Check size={16} />
                </span>
            )}
        </div>
    );
};

export default CodeHighlighter;
