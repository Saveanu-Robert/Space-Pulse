'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './chart-container';
import { CHART_THEME } from '@/lib/config/constants';
import type { NEOApproach } from '@/types/neos';
import { format, parseISO } from 'date-fns';

interface NeoApproachesChartProps {
  approaches: NEOApproach[];
  isLoading?: boolean;
}

export function NeoApproachesChart({ approaches, isLoading }: NeoApproachesChartProps) {
  const dateMap = new Map<string, { total: number; hazardous: number }>();

  for (const a of approaches) {
    const existing = dateMap.get(a.closeApproachDate) ?? { total: 0, hazardous: 0 };
    existing.total++;
    if (a.hazardous) existing.hazardous++;
    dateMap.set(a.closeApproachDate, existing);
  }

  const data = Array.from(dateMap.entries())
    .map(([date, counts]) => ({
      date,
      label: format(parseISO(date), 'MMM d'),
      total: counts.total,
      hazardous: counts.hazardous,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ChartContainer
      title="Close Approaches by Day"
      isLoading={isLoading}
      isEmpty={data.length === 0}
    >
      <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray={CHART_THEME.grid.strokeDasharray} stroke={CHART_THEME.grid.stroke} />
        <XAxis dataKey="label" tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
        <YAxis allowDecimals={false} tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
        <Tooltip contentStyle={CHART_THEME.tooltip.contentStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }} />
        <Bar dataKey="total" name="Total" fill={CHART_THEME.colors.neo} radius={[2, 2, 0, 0]} />
        <Bar dataKey="hazardous" name="Hazardous" fill={CHART_THEME.colors.hazardous} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
