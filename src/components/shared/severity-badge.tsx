import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Severity } from '@/types/common';

const severityStyles: Record<Severity, string> = {
  low: 'bg-status-safe/10 text-status-safe border-status-safe/20',
  moderate: 'bg-nebula-blue/10 text-nebula-blue border-nebula-blue/20',
  high: 'bg-status-warning/10 text-status-warning border-status-warning/20',
  extreme: 'bg-status-danger/10 text-status-danger border-status-danger/20',
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge variant="outline" className={cn('text-[10px] font-medium uppercase', severityStyles[severity])}>
      {severity}
    </Badge>
  );
}
