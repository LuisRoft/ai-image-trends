import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ImageGeneratorSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl py-8">
      <div className="mb-6 space-y-4 border-b border-zinc-200/80 pb-6">
        <Skeleton className="h-10 w-40" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-24 w-full rounded-2xl sm:h-28 sm:w-36" />
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-9 w-3/5" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Card className="border-zinc-200/80 bg-white/90">
            <CardHeader className="border-b border-zinc-100 pb-5">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-28 w-full rounded-2xl" />
                <div className="flex gap-3 overflow-hidden">
                  <Skeleton className="h-32 w-28 rounded-xl" />
                  <Skeleton className="h-32 w-28 rounded-xl" />
                  <Skeleton className="h-32 w-28 rounded-xl" />
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-4/5" />
                <div className="grid grid-cols-2 gap-2 rounded-2xl">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-5 w-32" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-28 w-full rounded-2xl" />
                  <Skeleton className="h-28 w-full rounded-2xl" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>

              <div className="space-y-4 border-t border-zinc-200 pt-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-52" />
                  </div>
                  <Skeleton className="h-9 w-20 rounded-md" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-44 w-full rounded-xl" />
              </div>

              <div className="space-y-3 rounded-2xl border border-zinc-200 p-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden border-zinc-200/80 bg-white/90">
          <CardHeader className="border-b border-zinc-100 pb-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-4 w-72" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <Skeleton className="aspect-square w-full rounded-[28px] md:aspect-[4/3]" />
            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28 rounded-md" />
                <Skeleton className="h-9 w-32 rounded-md" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
