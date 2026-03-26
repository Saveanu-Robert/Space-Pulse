'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGlobalRefresh } from '@/hooks/use-refresh';
import { motion } from 'framer-motion';

export function GlobalRefreshButton() {
  const { refreshAll, isRefreshing } = useGlobalRefresh();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={refreshAll}
      disabled={isRefreshing}
      className="gap-2 text-muted-foreground hover:text-foreground"
      aria-label="Refresh all dashboard data"
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isRefreshing
            ? { duration: 1, repeat: Infinity, ease: 'linear' }
            : { duration: 0.3 }
        }
      >
        <RefreshCw className="h-4 w-4" />
      </motion.div>
      <span className="hidden sm:inline">Refresh All</span>
    </Button>
  );
}
