import { Skeleton } from './Skeleton';

interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  loading?: boolean;
}

export function StatTile({ label, value, hint, loading = false }: StatTileProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-20" />
      ) : (
        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      )}
      {hint && !loading && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
