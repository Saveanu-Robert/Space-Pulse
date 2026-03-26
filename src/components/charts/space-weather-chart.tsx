'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './chart-container';
import { CHART_THEME } from '@/lib/config/constants';
import type { SpaceWeatherChartDataPoint } from '@/types/space-weather';
import { format, parseISO } from 'date-fns';

interface SpaceWeatherChartProps {
  data: SpaceWeatherChartDataPoint[];
  isLoading?: boolean;
}

export function SpaceWeatherChart({ data, isLoading }: SpaceWeatherChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'MMM d'),
  }));

  return (
    <ChartContainer
      title="Space Weather Events by Day"
      isLoading={isLoading}
      isEmpty={data.length === 0}
    >
      <BarChart data={formatted} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray={CHART_THEME.grid.strokeDasharray} stroke={CHART_THEME.grid.stroke} />
        <XAxis dataKey="label" tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
        <YAxis allowDecimals={false} tick={CHART_THEME.axis.tick} stroke={CHART_THEME.axis.stroke} />
        <Tooltip contentStyle={CHART_THEME.tooltip.contentStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }} />
        <Bar dataKey="flares" name="Solar Flares" fill={CHART_THEME.colors.flare} radius={[2, 2, 0, 0]} stackId="stack" />
        <Bar dataKey="cmes" name="CMEs" fill={CHART_THEME.colors.cme} radius={[2, 2, 0, 0]} stackId="stack" />
        <Bar dataKey="geomagneticStorms" name="Geomagnetic Storms" fill={CHART_THEME.colors.gst} radius={[2, 2, 0, 0]} stackId="stack" />
      </BarChart>
    </ChartContainer>
  );
}
