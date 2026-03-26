'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './chart-container';
import { CHART_THEME, CATEGORY_COLORS } from '@/lib/config/constants';
import type { EventCategorySummary } from '@/types/earth-events';

const DEFAULT_COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#22C55E', '#F97316', '#A855F7'];

interface EarthEventsChartProps {
  categories: EventCategorySummary[];
  isLoading?: boolean;
}

export function EarthEventsChart({ categories, isLoading }: EarthEventsChartProps) {
  const data = categories.map((cat, index) => ({
    name: cat.title,
    value: cat.count,
    color: CATEGORY_COLORS[cat.id] ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  return (
    <ChartContainer
      title="Events by Category"
      isLoading={isLoading}
      isEmpty={data.length === 0}
      height={300}
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip contentStyle={CHART_THEME.tooltip.contentStyle} />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}
          layout="vertical"
          align="right"
          verticalAlign="middle"
        />
      </PieChart>
    </ChartContainer>
  );
}
