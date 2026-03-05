import { Skeleton } from '@/components/ui/skeleton';

export function PromptCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-zinc-100">
      <Skeleton className="absolute inset-0 rounded-2xl" />
      <div className="absolute top-3 left-3">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function PromptGridSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-6 w-80" />
      </div>

      {/* Filters skeleton */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full sm:w-64" />
      </div>

      {/* Results count skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <PromptCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
