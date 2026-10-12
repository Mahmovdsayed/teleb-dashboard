'use client';

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CollectionSkeleton = () => {
    return (
        <section>
            <div className="pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
                <div className="space-y-1.5">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-4 w-60" />
                </div>
                <Skeleton className="h-9 w-full lg:w-36 rounded-md" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="gap-0 shadow-none">
                        <CardHeader className="pb-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <Skeleton className="size-11 shrink-0 rounded-lg" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="border-t pt-3">
                                <Skeleton className="h-3.5 w-40" />
                            </div>
                        </CardContent>

                        <CardFooter className="mt-4 grid grid-cols-2 gap-2">
                            <Skeleton className="h-8 w-full rounded-md" />
                            <Skeleton className="h-8 w-full rounded-md" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default CollectionSkeleton;