export function StaleIndicator() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-status-stale" role="status">
      <div className="h-1.5 w-1.5 rounded-full bg-status-stale animate-pulse" />
      <span>Data may be stale</span>
    </div>
  );
}
