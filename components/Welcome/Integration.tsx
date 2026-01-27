import CodeHighlighter from '@/app/docs/_components/CodeHighlighter';

const Integration = () => {
    return (
        <section
            id="how-it-works"
            className="py-24 border-t border-white/5 bg-background"
        >
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Basic Usage
                    </h2>
                    <p className="text-base text-zinc-400 font-light leading-relaxed">
                        The CheFu Academy SDK uses API keys to authenticate
                        requests and associate them with your account. This
                        ensures secure access, usage tracking, and abuse
                        prevention.
                    </p>

                    <CodeHighlighter
                        code={`npm install chefu-academy-sdk`}
                        showLineNumbers={false}
                    />
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 text-sm  font-light">
                            <div className="w-6 h-6 rounded-full  border border-zinc-600 flex items-center justify-center text-[10px]">
                                1
                            </div>
                            Install the official CheFu Academy SDK using npm or
                            yarn.
                        </div>

                        <div className="w-px h-4 bg-zinc-800 ml-3"></div>

                        <div className="flex items-center gap-4 text-sm font-light">
                            <div className="w-6 h-6 rounded-full  border border-zinc-600 flex items-center justify-center text-[10px]">
                                2
                            </div>
                            Initialize the SDK with your API key.
                        </div>

                        <div className="w-px h-4 bg-zinc-800 ml-3"></div>

                        <div className="flex items-center gap-4 text-sm font-light">
                            <div className="w-6 h-6 rounded-full border border-zinc-600 flex items-center justify-center text-[10px]">
                                3
                            </div>
                            Start fetching content.
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-lg">
                    <div className="glass-card rounded-xl p-3 relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/40 border-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/40 border-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/40 border-green-500/50"></div>
                            </div>
                            <span className="text-xs text-zinc-600 font-mono">
                                index.js
                            </span>
                        </div>

                        <CodeHighlighter
                            code={`import CheFuAcademy from 'chefu-academy-sdk';

const sdk = new CheFuAcademy({
    apiKey: process.env.CHEFU_ACADEMY_API_KEY,
});

const courses = await sdk.courses.getAll();
console.log(courses);`}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Integration;
