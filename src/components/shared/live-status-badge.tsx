'use client';

export function LiveStatusBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-safe opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-status-safe" />
      </span>
      <span className="text-xs text-muted-foreground">Updated every 60s</span>
    </div>
  );
}
