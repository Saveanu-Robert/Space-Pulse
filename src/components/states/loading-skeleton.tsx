import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return <div className={cn('shimmer-bg rounded-md', className)} />;
}

export function HeroSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="shimmer-bg aspect-[21/9] w-full" />
      <div className="p-6">
        <div className="shimmer-bg h-8 w-3/4 rounded mb-3" />
        <div className="shimmer-bg h-4 w-1/4 rounded mb-4" />
        <div className="shimmer-bg h-4 w-full rounded mb-2" />
        <div className="shimmer-bg h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass-card p-4">
          <div className="shimmer-bg h-4 w-16 rounded mb-3" />
          <div className="shimmer-bg h-8 w-12 rounded" />
        </div>
      ))}
    </div>
  );
}

export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="shimmer-bg h-4 w-3/4 rounded mb-2" />
              <div className="shimmer-bg h-3 w-1/2 rounded" />
            </div>
            <div className="shimmer-bg h-5 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="shimmer-bg h-5 w-40 rounded mb-4" />
      <div className="shimmer-bg h-[250px] w-full rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/[0.06]">
        <div className="shimmer-bg h-5 w-32 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/[0.04]">
          <div className="shimmer-bg h-4 w-40 rounded" />
          <div className="shimmer-bg h-4 w-20 rounded" />
          <div className="shimmer-bg h-4 w-24 rounded" />
          <div className="shimmer-bg h-4 w-16 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="shimmer-bg h-[400px] md:h-[500px] w-full" />
    </div>
  );
}
