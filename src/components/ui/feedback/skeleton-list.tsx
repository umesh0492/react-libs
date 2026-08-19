import { Skeleton } from "../feedback/skeleton";

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4 w-full p-4 border border-slate-200 shadow-sm rounded-lg bg-white">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-64 bg-slate-100" />
        <Skeleton className="h-10 w-32 bg-slate-100" />
        <Skeleton className="h-10 w-32 bg-slate-100" />
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-slate-100 pb-3">
            <Skeleton className="h-12 w-full bg-slate-50" />
          </div>
        ))}
      </div>
    </div>
  );
}
