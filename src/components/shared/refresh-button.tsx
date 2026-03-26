'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModuleRefresh } from '@/hooks/use-refresh';
import { motion } from 'framer-motion';

interface RefreshButtonProps {
  queryKey: readonly string[];
  label?: string;
}

export function RefreshButton({ queryKey, label }: RefreshButtonProps) {
  const { refresh, isRefreshing } = useModuleRefresh(queryKey);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={refresh}
      disabled={isRefreshing}
      className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      aria-label={label ?? 'Refresh section'}
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isRefreshing
            ? { duration: 1, repeat: Infinity, ease: 'linear' }
            : { duration: 0.3 }
        }
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </motion.div>
    </Button>
  );
}
