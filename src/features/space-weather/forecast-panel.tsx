'use client';

import { useMemo } from 'react';
import type { NotificationItem } from '@/types/space-weather';
import { CloudSun, AlertTriangle, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForecastPanelProps {
  notifications: NotificationItem[];
}

interface Forecast {
  key: string;
  icon: React.ElementType;
  label: string;
  detail: string;
  severity: 'low' | 'medium' | 'high';
}

const severityStyle = {
  low: 'border-status-safe/20 bg-status-safe/5',
  medium: 'border-status-warning/20 bg-status-warning/5',
  high: 'border-status-danger/20 bg-status-danger/5',
};

export function ForecastPanel({ notifications }: ForecastPanelProps) {
  const forecasts = useMemo(() => extractForecasts(notifications), [notifications]);

  if (forecasts.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <CloudSun className="h-4 w-4 text-nebula-cyan" />
        <h3 className="text-sm font-semibold text-white">Space Weather Forecast</h3>
      </div>
      <div className="space-y-2">
        {forecasts.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.key} className={cn('rounded-lg border p-2.5', severityStyle[f.severity])}>
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs font-medium text-white">{f.label}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 ml-6">{f.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function extractForecasts(notifications: NotificationItem[]): Forecast[] {
  const forecasts: Forecast[] = [];
  const seen = new Set<string>();

  for (const n of notifications.slice(0, 5)) {
    const body = n.body.toLowerCase();

    if (body.includes('g1') || body.includes('g2') || body.includes('g3') || body.includes('geomagnetic storm watch')) {
      const key = 'storm-watch';
      if (!seen.has(key)) {
        const level = body.includes('g3') || body.includes('g4') || body.includes('g5') ? 'high' :
                      body.includes('g2') ? 'medium' : 'low';
        forecasts.push({ key, icon: AlertTriangle, label: 'Geomagnetic Storm Watch', detail: 'Possible auroral activity at high latitudes', severity: level });
        seen.add(key);
      }
    }

    if (body.includes('cme') && (body.includes('earth-directed') || body.includes('arrival'))) {
      const key = 'cme-arrival';
      if (!seen.has(key)) {
        forecasts.push({ key, icon: Radio, label: 'CME Earth Impact Possible', detail: 'Coronal mass ejection may reach Earth within 1-3 days', severity: 'medium' });
        seen.add(key);
      }
    }

    if (body.includes('radio blackout') || body.includes('r1') || body.includes('r2')) {
      const key = 'radio';
      if (!seen.has(key)) {
        forecasts.push({ key, icon: Radio, label: 'Radio Blackout Risk', detail: 'HF radio communication may be affected', severity: body.includes('r2') || body.includes('r3') ? 'high' : 'low' });
        seen.add(key);
      }
    }
  }

  if (forecasts.length === 0) {
    forecasts.push({ key: 'quiet', icon: CloudSun, label: 'Conditions Normal', detail: 'No significant space weather alerts active', severity: 'low' });
  }

  return forecasts;
}
