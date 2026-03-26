'use client';

import { ResponsiveContainer } from 'recharts';
import { ChartSkeleton } from '@/components/states/loading-skeleton';
import { EmptyState } from '@/components/states/empty-state';
import { BarChart3 } from 'lucide-react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  height?: number;
  isLoading?: boolean;
  isEmpty?: boolean;
}

export function ChartContainer({ title, children, height = 280, isLoading, isEmpty }: ChartContainerProps) {
  if (isLoading) return <ChartSkeleton />;

  if (isEmpty) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
        <EmptyState icon={BarChart3} title="No data available" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
