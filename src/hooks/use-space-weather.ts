'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { apiClient } from '@/lib/api/client';
import { REFRESH_INTERVAL_MS } from '@/lib/config/constants';

export function useSpaceWeather(days: number = 7) {
  return useQuery({
    queryKey: [...queryKeys.spaceWeather.root, String(days)],
    queryFn: ({ signal }) => apiClient.getSpaceWeather(days, { signal }),
    refetchInterval: REFRESH_INTERVAL_MS,
  });
}
