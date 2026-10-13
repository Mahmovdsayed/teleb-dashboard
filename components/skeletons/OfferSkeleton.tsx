'use client';

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const OfferCardSkeleton = () => {
    return (
        <Card className="gap-0 overflow-hidden shadow-none">
            <CardHeader className="pb-3 space-y-3">
                <div className="flex min-w-0 items-start gap-3">
                    <Skeleton className="size-11 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-7 w-14 shrink-0 rounded-md" />
                </div>
                <div className="space-y-1.5 pt-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <div className="flex gap-3">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>

                <div className="space-y-2 border-t pt-3">
                    <Skeleton className="h-3 w-24" />
                    <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-12 w-full rounded-md" />
                        <Skeleton className="h-12 w-full rounded-md" />
                    </div>
                </div>

                <div className="space-y-2 border-t pt-3">
                    <Skeleton className="h-3 w-28" />
                    <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="mt-4 grid grid-cols-2 gap-2">
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
            </CardFooter>
        </Card>
    );
};

const OfferSkeleton = () => {
    return (
        <section className="space-y-6">
            <div className="pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
                <div className="space-y-1.5">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-9 w-full lg:w-36 rounded-md" />
            </div>

            <Card className="gap-0 overflow-hidden bg-sidebar p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-4 rounded" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-md" />
                </div>
            </Card>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <OfferCardSkeleton key={i} />
                ))}
            </div>
        </section>
    );
};

export default OfferSkeleton;
