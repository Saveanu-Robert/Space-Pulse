'use client';

import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { useCallback, useState } from 'react';

export function useGlobalRefresh() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: queryKeys.all });
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  }, [queryClient]);

  return { refreshAll, isRefreshing };
}

export function useModuleRefresh(queryKey: readonly string[]) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey });
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  }, [queryClient, queryKey]);

  return { refresh, isRefreshing };
}
