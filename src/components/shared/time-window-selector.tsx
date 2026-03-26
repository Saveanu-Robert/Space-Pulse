'use client';

import { cn } from '@/lib/utils';

interface TimeWindowSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options?: { label: string; value: string }[];
}

const DEFAULT_OPTIONS = [
  { label: '24h', value: '1' },
  { label: '7d', value: '7' },
  { label: '30d', value: '30' },
];

export function TimeWindowSelector({ value, onChange, options = DEFAULT_OPTIONS }: TimeWindowSelectorProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
            value === opt.value
              ? 'bg-nebula-blue/20 text-nebula-blue'
              : 'text-muted-foreground hover:text-white'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
