'use client';

import { Search, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NeoFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  hazardousOnly: boolean;
  onHazardousOnlyChange: (value: boolean) => void;
  totalCount: number;
  filteredCount: number;
}

export function NeoFilterBar({
  search,
  onSearchChange,
  hazardousOnly,
  onHazardousOnlyChange,
  totalCount,
  filteredCount,
}: NeoFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search asteroids..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-nebula-blue/50 focus:ring-1 focus:ring-nebula-blue/30 transition-colors"
          aria-label="Search near-Earth objects by name"
        />
      </div>
      <button
        onClick={() => onHazardousOnlyChange(!hazardousOnly)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
          hazardousOnly
            ? 'border-status-danger/40 bg-status-danger/10 text-status-danger'
            : 'border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-white'
        )}
        aria-pressed={hazardousOnly}
        aria-label="Filter hazardous objects only"
      >
        <ShieldAlert className="h-3.5 w-3.5" />
        Hazardous Only
      </button>
      {(search || hazardousOnly) && (
        <span className="text-[10px] text-muted-foreground">
          Showing {filteredCount} of {totalCount}
        </span>
      )}
    </div>
  );
}
