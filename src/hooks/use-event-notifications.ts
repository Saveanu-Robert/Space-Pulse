'use client';

import { useEffect, useRef } from 'react';
import { useSpaceWeather } from './use-space-weather';
import { showToast } from '@/components/shared/toast-container';

export function useEventNotifications() {
  const { data: response } = useSpaceWeather(7);
  const prevCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (!response?.success || !response.data) return;

    const currentTotal =
      response.data.counts.flares +
      response.data.counts.cmes +
      response.data.counts.geomagneticStorms;

    if (prevCountRef.current !== null && currentTotal > prevCountRef.current) {
      const diff = currentTotal - prevCountRef.current;
      const latest = response.data.timeline[0];

      showToast({
        title: `${diff} new space weather event${diff > 1 ? 's' : ''} detected`,
        description: latest ? latest.title : undefined,
        type: latest?.severity === 'extreme' || latest?.severity === 'high' ? 'warning' : 'info',
      });
    }

    prevCountRef.current = currentTotal;
  }, [response]);
}
