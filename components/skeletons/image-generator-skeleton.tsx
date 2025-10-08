import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ImageGeneratorSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-10 w-40 mb-4" />

        <div className="flex items-start gap-6">
          <div className="relative">
            <Skeleton className="w-[300px] h-[200px] rounded-lg" />
          </div>

          <div className="flex-1">
            <Skeleton className="h-9 w-3/4 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-4/5 mb-4" />

            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-5 w-14" />
            </div>

            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image upload section skeleton */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            {/* Customization instructions skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </div>
            </div>

            {/* Prompt editor skeleton */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>

            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>

        {/* Results Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-5 w-64 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
