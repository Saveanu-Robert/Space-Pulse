'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { apiClient } from '@/lib/api/client';

export function useApodGallery() {
  return useQuery({
    queryKey: queryKeys.apod.gallery,
    queryFn: ({ signal }) => apiClient.getApodGallery({ signal }),
    staleTime: 5 * 60_000, // 5 min
    refetchInterval: 5 * 60_000,
  });
}
