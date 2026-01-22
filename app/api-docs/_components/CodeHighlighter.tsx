import { Check, Copy } from 'lucide-react';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

interface CodeHighlighterProps {
    code: string;
    language?: string;
}

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
    code,
    language = 'javascript',
}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative mt-4">
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    overflowX: 'auto',
                    backgroundColor: '#1e1e1e',
                }}
            >
                {code}
            </SyntaxHighlighter>

            {!copied ? (
                <Copy
                    size={20}
                    onClick={handleCopy}
                    className="absolute top-3 right-3 cursor-pointer text-white"
                />
            ) : (
                <Check
                    size={20}
                    className="absolute top-3 right-3 text-green-500"
                />
            )}
        </div>
    );
};

export default CodeHighlighter;
