import React from 'react';

const Integration = () => {
    return (
        <section
            id="how-it-works"
            className="py-24 border-t border-white/5 bg-background"
        >
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                        Drop-in simplicity
                    </h2>
                    <p className="text-lg text-zinc-400 font-light mb-8 leading-relaxed">
                        No complex SDKs or user syncing. Just add our script tag
                        and you&apos;re live. We inherit your CSS variables
                        automatically.
                    </p>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 text-sm  font-light">
                            <div className="w-6 h-6 rounded-full  border border-zinc-600 flex items-center justify-center text-[10px]">
                                1
                            </div>
                            Scan your documentation URL
                        </div>

                        <div className="w-px h-6 bg-zinc-800 ml-3"></div>

                        <div className="flex items-center gap-4 text-sm font-light">
                            <div className="w-6 h-6 rounded-full  border border-zinc-600 flex items-center justify-center text-[10px]">
                                2
                            </div>
                            Copy the embed snippet
                        </div>

                        <div className="w-px h-6 bg-zinc-800 ml-3"></div>

                        <div className="flex items-center gap-4 text-sm font-light">
                            <div className="w-6 h-6 rounded-full border border-zinc-600 flex items-center justify-center text-[10px]">
                                3
                            </div>
                            Auto-resolved tickets
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-lg">
                    <div className="glass-card rounded-xl p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border-green-500/50"></div>
                            </div>
                            <span className="text-xs text-zinc-600 font-mono">
                                index.html
                            </span>
                        </div>

                        <div className="font-mono text-xs md:text-sm leading-7 text-zinc-400">
                            <div className="text-zinc-600">
                                &lt;!-- CheFu Academy --&gt;
                            </div>
                            <div>
                                &lt;
                                <span className="text-pink-400">script</span>
                            </div>
                            <div className="pl-4">
                                <span className="text-indigo-400">src=</span>
                                <span className="text-emerald-400">
                                    &quot;https://chefuacademy.com/init.js&quot;
                                </span>
                            </div>
                            <div className="pl-4">
                                <span className="text-indigo-400">
                                    data-id=
                                </span>
                                <span className="text-emerald-400">
                                    &quot;557ffe5r4-d7rgz5f-hf5ue6u848&quot;
                                </span>
                            </div>
                            <div>
                                &lt;/
                                <span className="text-pink-400">script</span>
                                &gt;
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Integration;
