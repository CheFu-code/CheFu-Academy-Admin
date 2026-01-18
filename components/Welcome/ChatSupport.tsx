'use client';

import { Send, User } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const ChatSupport = () => {
    const router = useRouter();
    const [input, setInput] = useState('');

    const handleTestSend = () => {
        if (!input.trim()) {
            toast.warning("You can't send empty message");
            return;
        }
        toast.success('Connecting you with support...');
        router.push(`/support/chat?message=${input.trim()}`);
    };
    return (
        <section className="py-24 border-t border-white/5 bg-background">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                    Chat Support
                </h2>
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="rounded-2xl p-1 md:p-2 relative overflow-hidden ring-1 ring-white/10 bg-[#0a0a0e] shadow-2xl">
                    <div className="flex flex-col h-125 md:h-150 w-full bg-[#0a0a0e] rounded-xl overflow-hidden">
                        <div className="h-14 border border-white/5 flex items-center justify-between px-6 bg-[#0e0e12] shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-medium text-zinc-300">
                                    CheFu Academy
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-6  bg-zinc-950/30">
                            <div className="flex w-full flex-col items-start">
                                <div className="flex max-w-[85%] gap-3 flex-row">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                                        <Image
                                            alt="Support Agent"
                                            className="w-full h-full object-cover"
                                            width={40}
                                            height={40}
                                            src={'/logo.png'}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="p-2.5 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-zinc-900 rounded-tl-sm">
                                            Hi there, how can I help you today?
                                        </div>

                                        <div className="flex flex-wrap gap-2 pt-1 ml-1">
                                            <span className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-medium cursor-default">
                                                FAQ
                                            </span>
                                            <span className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-medium cursor-default">
                                                Pricing
                                            </span>
                                            <span className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-medium cursor-default">
                                                Support
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/**User message */}
                                <div className="flex w-full flex-col items-end mt-5">
                                    <div className="flex max-w-[85%] gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 bg-zinc-800">
                                            <User className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="p-2.5 rounded-2xl text-sm leading-relaxed shadow-sm bg-zinc-800 text-zinc-200 rounded-tr-sm">
                                            Hi, I&apos;m trying to update my
                                            card details but it&apos;s not
                                            working.
                                        </div>
                                    </div>
                                </div>

                                {/**Agent message */}
                                <div className="flex w-full flex-col items-start mt-5">
                                    <div className="flex max-w-[85%] gap-3 flex-row">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                                            <Image
                                                alt="Support Agent"
                                                src={'/logo.png'}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-2.5 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-zinc-900 rounded-tl-sm">
                                            Hi! Sorry to hear that. Can you tell
                                            me exactly where you&apos;re getting
                                            stuck? Are you getting an error
                                            message?
                                        </div>
                                    </div>
                                </div>

                                {/**User message */}
                                <div className="flex w-full flex-col items-end mt-5">
                                    <div className="flex max-w-[85%] gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 bg-zinc-800">
                                            <User className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="p-2.5 rounded-2xl text-sm leading-relaxed shadow-sm bg-zinc-800 text-zinc-200 rounded-tr-sm">
                                            I&apos;m on the payment section, I
                                            click update card but nothing
                                            happens.
                                        </div>
                                    </div>
                                </div>

                                {/**typing effect */}
                                <div className="flex w-full flex-col items-start mt-5">
                                    <div className="flex max-w-[85%] gap-3 flex-row">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                                            <Image
                                                alt="Support Agent"
                                                src={'/logo.png'}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <i className="animate-caret-blink text-center text-lg text-white">
                                            ...
                                        </i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-2 bg-[#0a0a0e] border-t border-white/5 shrink-0">
                            <div className="relative">
                                <div className=" w-full flex items-center justify-between">
                                    <Input
                                        style={{ color: 'white' }}
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        placeholder="Type a message..."
                                    />
                                    <button
                                        disabled={!input.trim()}
                                        onClick={handleTestSend}
                                        className="h-8 w-8 ml-5 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 cursor-pointer"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChatSupport;
