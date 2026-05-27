import { DocsHeader, DocsSidebar } from './_components/DocsShell';

const APILayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="docs-scrollbar h-screen overflow-y-auto bg-[#050505] text-white">
            <DocsHeader />
            <div className="border-t border-white/10">
                <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1680px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <DocsSidebar />
                    <main className="min-w-0">{children}</main>
                </div>
            </div>
        </div>
    );
};

export default APILayout;
