'use client';

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOTION } from '@/lib/config/constants';
import { AnimatedNumber } from './animated-number';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accentColor?: 'blue' | 'violet' | 'cyan' | 'amber' | 'red';
  isLoading?: boolean;
}

const accentClasses = {
  blue: 'text-nebula-blue',
  violet: 'text-nebula-violet',
  cyan: 'text-nebula-cyan',
  amber: 'text-status-warning',
  red: 'text-status-danger',
} as const;

const glowClasses = {
  blue: 'shadow-[0_0_20px_rgba(59,130,246,0.1)]',
  violet: 'shadow-[0_0_20px_rgba(139,92,246,0.1)]',
  cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.1)]',
  amber: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]',
  red: 'shadow-[0_0_20px_rgba(239,68,68,0.1)]',
} as const;

export function StatCard({ label, value, icon: Icon, accentColor = 'blue', isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-4">
        <div className="shimmer-bg h-4 w-16 rounded mb-3" />
        <div className="shimmer-bg h-8 w-12 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      className={cn('glass-card glass-card-hover p-4', glowClasses[accentColor])}
      {...MOTION.cardHover}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <Icon className={cn('h-4 w-4', accentClasses[accentColor])} />
      </div>
      <div className="text-2xl font-bold text-white tabular-nums">
        {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
      </div>
    </motion.div>
  );
}
