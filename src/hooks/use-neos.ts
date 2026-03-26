'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { apiClient } from '@/lib/api/client';
import { REFRESH_INTERVAL_MS } from '@/lib/config/constants';

export function useNeos() {
  return useQuery({
    queryKey: queryKeys.neos.root,
    queryFn: ({ signal }) => apiClient.getNeos({ signal }),
    refetchInterval: REFRESH_INTERVAL_MS,
  });
}
