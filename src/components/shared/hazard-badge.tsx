import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export function HazardBadge({ hazardous }: { hazardous: boolean }) {
  if (hazardous) {
    return (
      <Badge variant="outline" className="gap-1 bg-status-danger/10 text-status-danger border-status-danger/20 text-[10px]">
        <ShieldAlert className="h-3 w-3" />
        Hazardous
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 bg-status-safe/10 text-status-safe border-status-safe/20 text-[10px]">
      <ShieldCheck className="h-3 w-3" />
      Safe
    </Badge>
  );
}
