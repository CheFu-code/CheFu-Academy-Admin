import { Skeleton } from '@/components/ui/skeleton';

const VideoDetailsSkeleton = () => {
    return (
        <div className="flex w-full flex-col gap-5">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <Skeleton className="aspect-video w-full rounded-none" />
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                <section className="space-y-5">
                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="mt-4 h-8 w-4/5" />
                        <Skeleton className="mt-3 h-4 w-64" />
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Skeleton className="h-8 w-24 rounded-full" />
                            <Skeleton className="h-8 w-28 rounded-full" />
                            <Skeleton className="h-8 w-20 rounded-full" />
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <Skeleton className="h-9 w-56" />
                        <Skeleton className="mt-5 h-24 w-full" />
                    </div>
                </section>

                <aside className="space-y-4">
                    <div className="rounded-2xl border bg-card p-5 shadow-sm">
                        <Skeleton className="h-5 w-36" />
                        <div className="mt-5 space-y-3">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default VideoDetailsSkeleton;
