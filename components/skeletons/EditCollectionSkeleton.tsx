import { Skeleton } from "@/components/ui/skeleton";

const EditCollectionSkeleton = () => {
    return (
        <div className="flex flex-col justify-center text-center">
            <div className="flex flex-col items-center justify-center mt-4 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3.5 w-64" />
            </div>

            <div className="my-8 flex items-center justify-center">
                <div className="flex w-full max-w-lg flex-col gap-4 px-4">
                    <div className="flex flex-col gap-2 text-start">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-7 w-full rounded-md" />
                        <Skeleton className="h-3 w-48" />
                    </div>

                    <div className="flex flex-col gap-2 text-start">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-7 w-full rounded-md" />
                        <Skeleton className="h-3 w-48" />
                    </div>

                    <div className="flex flex-col gap-2 text-start">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-7 w-full rounded-md" />
                        <Skeleton className="h-3 w-48" />
                    </div>

                    <div className="mt-4 grid w-full grid-cols-2 gap-2">
                        <Skeleton className="h-8 w-full rounded-md" />
                        <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCollectionSkeleton;
