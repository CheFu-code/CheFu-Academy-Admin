'use client';

import { Input } from '@/components/ui/input';
import { Send, User } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const Chat = () => {
    const searchParams = useSearchParams();
    const initialMessage = searchParams.get('message');
    const [input, setInput] = useState('');

    return (
        <div className="min-h-screen bg-background mt-8">
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
                            <span className="text-xs text-gray-500 items-end justify-end">
                                support
                            </span>
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
                                    </div>
                                </div>

                                {/**User message */}
                                <div className="flex w-full flex-col items-end mt-5">
                                    <div className="flex max-w-[85%] gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 bg-zinc-800">
                                            <User className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div className="p-2.5 rounded-2xl text-sm leading-relaxed shadow-sm bg-zinc-800 text-zinc-200 rounded-tr-sm">
                                            {initialMessage}
                                        </div>
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
            <div className="mt-6">
                <p className="text-center text-sm text-gray-500">
                    Want to pick up where you left off?{' '}
                    <a href="/login" className="text-primary hover:underline">
                        Login
                    </a>{' '}
                    to save your chat history.
                </p>
            </div>
        </div>
    );
};

export default Chat;
