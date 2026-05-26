import { Skeleton } from '@/components/ui/skeleton';

const CourseLearningSkeleton = () => {
    return (
        <div className="flex min-h-[calc(100svh-7rem)] w-full flex-col gap-5">
            <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="bg-[linear-gradient(135deg,rgba(6,182,212,0.10),rgba(16,185,129,0.06),transparent)] p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-3">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-10 w-full max-w-xl" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-28" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>

                    <div className="mt-6 space-y-2">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                </div>
            </section>

            <section className="flex flex-1">
                <article className="min-w-0 w-full rounded-xl border bg-card p-5 shadow-sm sm:p-6">
                    <div className="space-y-6">
                        <div className="border-b pb-5">
                            <Skeleton className="mb-3 h-11 w-11 rounded-lg" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="mt-3 h-7 w-3/4" />
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-11/12" />
                            <Skeleton className="h-4 w-10/12" />
                            <Skeleton className="h-4 w-9/12" />
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-36 w-full rounded-lg" />
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-24 w-full rounded-lg" />
                        </div>
                    </div>
                </article>
            </section>

            <div className="grid grid-cols-1 gap-3 rounded-xl border bg-card p-3 shadow-sm sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
            </div>
        </div>
    );
};

export default CourseLearningSkeleton;
