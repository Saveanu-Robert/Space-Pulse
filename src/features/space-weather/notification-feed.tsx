'use client';

import { useState } from 'react';
import type { NotificationItem } from '@/types/space-weather';
import { formatDateTime, truncateText } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, ExternalLink } from 'lucide-react';

interface NotificationFeedProps {
  notifications: NotificationItem[];
}

const typeLabels: Record<string, string> = {
  FLR: 'Flare',
  CME: 'CME',
  GST: 'Storm',
  MPC: 'Mag. Pulse',
  RBE: 'Radiation',
  report: 'Report',
};

export function NotificationFeed({ notifications }: NotificationFeedProps) {
  const [selected, setSelected] = useState<NotificationItem | null>(null);

  if (notifications.length === 0) return null;

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/[0.06] p-4">
          <Bell className="h-4 w-4 text-nebula-blue" />
          <h3 className="text-sm font-semibold text-white">NASA Notifications</h3>
          <Badge variant="outline" className="ml-auto text-[10px]">{notifications.length}</Badge>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <div className="divide-y divide-white/[0.04]">
            {notifications.slice(0, 10).map((notif) => (
              <button
                key={notif.id}
                onClick={() => setSelected(notif)}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-white/[0.03]"
              >
                <div className="mt-0.5 shrink-0">
                  <div className="h-2 w-2 rounded-full bg-nebula-blue" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] bg-nebula-blue/10 text-nebula-blue border-nebula-blue/20">
                      {typeLabels[notif.type] ?? notif.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{formatDateTime(notif.issueTime)}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/70 line-clamp-2">
                    {truncateText(notif.body, 120)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] border-white/[0.08]" style={{ backgroundColor: '#0B1228' }}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Bell className="h-4 w-4 text-nebula-blue" />
                  NASA {typeLabels[selected.type] ?? selected.type} Notification
                </DialogTitle>
                <DialogDescription>
                  Issued {formatDateTime(selected.issueTime)}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[50vh]">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/80 font-sans">
                  {selected.body}
                </pre>
              </ScrollArea>
              {selected.url && (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-nebula-blue hover:underline mt-2"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on DONKI
                </a>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
