import { Skeleton } from "@/components/ui/skeleton";

const EditOfferSkeleton = () => {
    return (
        <div className="flex flex-col justify-center text-center">
            <div className="flex flex-col items-center justify-center mt-4 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-72" />
            </div>

            <div className="my-8 flex items-center justify-center">
                <div className="flex w-full max-w-2xl flex-col gap-6 px-4">
                    <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <Skeleton className="size-8 rounded-full" />
                                <Skeleton className="h-3 w-14 hidden sm:block" />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 text-start">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="h-9 w-full rounded-md" />
                            <Skeleton className="h-3 w-56" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-28" />
                            <Skeleton className="h-9 w-full rounded-md" />
                            <Skeleton className="h-3 w-56" />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between gap-3">
                        <Skeleton className="h-8 w-24 rounded-md" />
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditOfferSkeleton;
