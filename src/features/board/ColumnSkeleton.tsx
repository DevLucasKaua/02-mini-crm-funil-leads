import { Skeleton } from '../../components/ui';

export function ColumnSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-6" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-4 w-20" />
            <Skeleton className="mt-2 h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
