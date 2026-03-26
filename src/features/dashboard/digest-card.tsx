'use client';

import { useDashboardOverview } from '@/hooks/use-dashboard-overview';
import { FileText } from 'lucide-react';

export function DigestCard() {
  const { data: response, isLoading } = useDashboardOverview();

  if (isLoading || !response?.data) return null;

  const { spaceWeather, neos, earthEvents } = response.data;
  const sw = spaceWeather.data;
  const neo = neos.data;
  const ev = earthEvents.data;

  const parts: string[] = [];

  if (sw) {
    const total = sw.counts.flares + sw.counts.cmes + sw.counts.geomagneticStorms;
    if (total > 0) {
      const items: string[] = [];
      if (sw.counts.flares > 0) items.push(`${sw.counts.flares} solar flare${sw.counts.flares !== 1 ? 's' : ''}`);
      if (sw.counts.cmes > 0) items.push(`${sw.counts.cmes} CME${sw.counts.cmes !== 1 ? 's' : ''}`);
      if (sw.counts.geomagneticStorms > 0) items.push(`${sw.counts.geomagneticStorms} geomagnetic storm${sw.counts.geomagneticStorms !== 1 ? 's' : ''}`);
      parts.push(items.join(', '));

      const extreme = sw.timeline.filter(t => t.severity === 'extreme');
      if (extreme.length > 0) parts.push(`including ${extreme.length} extreme-severity event${extreme.length !== 1 ? 's' : ''}`);
    }
  }

  if (neo) {
    parts.push(`${neo.totalUpcoming} near-Earth objects tracked`);
    if (neo.hazardousCount > 0) parts.push(`${neo.hazardousCount} classified as potentially hazardous`);
    if (neo.approaches.length > 0) {
      const closestLD = Math.min(...neo.approaches.map(a => a.missDistanceLunar));
      parts.push(`closest approach at ${closestLD.toFixed(1)} lunar distances`);
    }
  }

  if (ev) {
    const catParts = ev.categories.map(c => `${c.count} ${c.title.toLowerCase()}`);
    parts.push(`${ev.totalOpenEvents} active Earth events (${catParts.join(', ')})`);
  }

  if (parts.length === 0) return null;

  const digest = `This week: ${parts.join('. ')}.`;

  return (
    <div className="glass-card p-4">
      <div className="flex items-start gap-3">
        <FileText className="h-4 w-4 text-nebula-cyan shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-white/80">{digest}</p>
      </div>
    </div>
  );
}
