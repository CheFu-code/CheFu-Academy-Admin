'use client';

import { cn } from '@/lib/utils';
import { Check, Code2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CodeHighlighter from './CodeHighlighter';
import {
    docsLanguages,
    type DocsLanguageKey,
    type LanguageSnippetMap,
} from './languageExamples';

type LanguageExamplePickerProps = {
    title: string;
    description?: string;
    examples: LanguageSnippetMap;
    defaultLanguage?: DocsLanguageKey;
    className?: string;
};

const STORAGE_KEY = 'chefu-docs-language';
const LANGUAGE_EVENT = 'chefu-docs-language-change';

const isDocsLanguageKey = (value: string): value is DocsLanguageKey => {
    return docsLanguages.some((language) => language.key === value);
};

const readPreferredLanguage = (
    defaultLanguage: DocsLanguageKey,
): DocsLanguageKey => {
    if (typeof window === 'undefined') {
        return defaultLanguage;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && isDocsLanguageKey(stored) ? stored : defaultLanguage;
};

const LanguageExamplePicker = ({
    title,
    description,
    examples,
    defaultLanguage = 'typescript',
    className,
}: LanguageExamplePickerProps) => {
    const availableLanguages = useMemo(
        () => docsLanguages.filter((language) => examples[language.key]),
        [examples],
    );
    const firstLanguage = availableLanguages[0]?.key ?? defaultLanguage;
    const [selectedLanguage, setSelectedLanguage] =
        useState<DocsLanguageKey>(firstLanguage);

    useEffect(() => {
        const preferred = readPreferredLanguage(defaultLanguage);
        setSelectedLanguage(examples[preferred] ? preferred : firstLanguage);

        const handleLanguageChange = (event: Event) => {
            const detail = (event as CustomEvent<DocsLanguageKey>).detail;
            if (detail && examples[detail]) {
                setSelectedLanguage(detail);
            }
        };

        window.addEventListener(LANGUAGE_EVENT, handleLanguageChange);
        return () =>
            window.removeEventListener(LANGUAGE_EVENT, handleLanguageChange);
    }, [defaultLanguage, examples, firstLanguage]);

    const activeLanguage =
        availableLanguages.find(
            (language) => language.key === selectedLanguage,
        ) ?? availableLanguages[0];
    const activeSnippet = activeLanguage ? examples[activeLanguage.key] : null;

    const selectLanguage = (language: DocsLanguageKey) => {
        setSelectedLanguage(language);
        window.localStorage.setItem(STORAGE_KEY, language);
        window.dispatchEvent(
            new CustomEvent<DocsLanguageKey>(LANGUAGE_EVENT, {
                detail: language,
            }),
        );
    };

    if (!activeLanguage || !activeSnippet) {
        return null;
    }

    return (
        <div
            className={cn(
                'overflow-hidden rounded-lg border border-white/10 bg-[#090909]',
                className,
            )}
        >
            <div className="border-b border-white/10 bg-white/[0.025] p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-normal text-sky-300">
                            <Code2 className="size-4" />
                            Language example
                        </div>
                        <h3 className="mt-2 text-lg font-semibold tracking-normal text-white">
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                                {description}
                            </p>
                        )}
                    </div>

                    <div
                        role="tablist"
                        aria-label="Choose documentation language"
                        className="flex max-w-full gap-1 overflow-x-auto rounded-lg border border-white/10 bg-black p-1"
                    >
                        {availableLanguages.map((language) => {
                            const selected =
                                language.key === activeLanguage.key;
                            return (
                                <button
                                    key={language.key}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    onClick={() => selectLanguage(language.key)}
                                    className={cn(
                                        'inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-zinc-400 transition hover:text-white',
                                        selected &&
                                            'bg-white text-black hover:text-black',
                                    )}
                                >
                                    {selected && <Check className="size-3.5" />}
                                    {language.shortLabel}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-5">
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-white">
                            {activeLanguage.label}
                        </p>
                        <p className="text-xs text-zinc-500">
                            {activeLanguage.packageName} -{' '}
                            {activeLanguage.registry}
                        </p>
                    </div>
                    {activeSnippet.caption && (
                        <p className="max-w-xl text-sm leading-6 text-zinc-400">
                            {activeSnippet.caption}
                        </p>
                    )}
                </div>
                <CodeHighlighter
                    code={activeSnippet.code}
                    filename={activeSnippet.filename}
                    language={activeSnippet.language}
                    showLineNumbers={false}
                />
            </div>
        </div>
    );
};

export default LanguageExamplePicker;
