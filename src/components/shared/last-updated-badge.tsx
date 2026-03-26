'use client';

import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format';

const ALL_KEYS = [
  queryKeys.apod.root,
  queryKeys.spaceWeather.root,
  queryKeys.neos.root,
  queryKeys.earthEvents.root,
];

export function LastUpdatedBadge() {
  const queryClient = useQueryClient();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let mostRecent = 0;
      for (const key of ALL_KEYS) {
        const state = queryClient.getQueryState(key);
        if (state?.dataUpdatedAt && state.dataUpdatedAt > mostRecent) {
          mostRecent = state.dataUpdatedAt;
        }
      }
      if (mostRecent > 0) {
        setLastUpdated(new Date(mostRecent).toISOString());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [queryClient]);

  if (!lastUpdated) return null;

  return (
    <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
      <Clock className="h-3 w-3" />
      <span>{formatRelativeTime(lastUpdated)}</span>
    </div>
  );
}
