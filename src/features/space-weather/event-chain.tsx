'use client';

import { useMemo } from 'react';
import type { TimelineItem } from '@/types/space-weather';
import { formatDateTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import { Sun, Zap, Activity, ArrowRight } from 'lucide-react';

interface EventChainProps {
  timeline: TimelineItem[];
}

interface Chain {
  id: string;
  events: TimelineItem[];
}

const typeIcon = { FLR: Sun, CME: Zap, GST: Activity } as const;
const typeColor = {
  FLR: 'bg-status-warning/20 text-status-warning border-status-warning/30',
  CME: 'bg-nebula-violet/20 text-nebula-violet border-nebula-violet/30',
  GST: 'bg-status-danger/20 text-status-danger border-status-danger/30',
} as const;

export function EventChain({ timeline }: EventChainProps) {
  const chains = useMemo(() => buildChains(timeline), [timeline]);

  if (chains.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-white/[0.06] p-4">
        <h3 className="text-sm font-semibold text-white">Event Chains</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">Linked solar activity: flare → CME → storm</p>
      </div>
      <div className="max-h-[300px] overflow-y-auto divide-y divide-white/[0.04]">
        {chains.map((chain) => (
          <div key={chain.id} className="p-3">
            <div className="flex items-center gap-1 flex-wrap">
              {chain.events.map((event, i) => {
                const Icon = typeIcon[event.type];
                return (
                  <div key={event.id} className="flex items-center gap-1">
                    <div className={cn('flex items-center gap-1 rounded-md border px-2 py-1', typeColor[event.type])}>
                      <Icon className="h-3 w-3" />
                      <span className="text-[10px] font-medium">{event.type}</span>
                    </div>
                    {i < chain.events.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {chain.events.map(e => `${e.type} ${formatDateTime(e.date)}`).join(' → ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildChains(timeline: TimelineItem[]): Chain[] {
  // Group events that occur within 72 hours of each other into chains
  // A chain should have different event types (FLR→CME, CME→GST, etc.)
  const sorted = [...timeline].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const chains: Chain[] = [];
  const used = new Set<string>();

  for (let i = 0; i < sorted.length; i++) {
    if (used.has(sorted[i].id)) continue;
    const chain: TimelineItem[] = [sorted[i]];
    used.add(sorted[i].id);

    for (let j = i + 1; j < sorted.length; j++) {
      if (used.has(sorted[j].id)) continue;
      const lastTime = new Date(chain[chain.length - 1].date).getTime();
      const nextTime = new Date(sorted[j].date).getTime();
      const hoursDiff = (nextTime - lastTime) / (1000 * 60 * 60);

      if (hoursDiff > 0 && hoursDiff <= 72 && sorted[j].type !== chain[chain.length - 1].type) {
        chain.push(sorted[j]);
        used.add(sorted[j].id);
        if (chain.length >= 3) break;
      }
    }

    if (chain.length >= 2) {
      chains.push({ id: chain.map(e => e.id).join('-'), events: chain });
    }
  }

  return chains.slice(0, 5);
}
