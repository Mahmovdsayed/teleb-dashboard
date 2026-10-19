import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
}

export default function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
          <Skeleton className="size-10 rounded-lg shrink-0" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full hidden sm:block" />
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}
