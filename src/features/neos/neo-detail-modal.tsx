'use client';

import type { NEOApproach } from '@/types/neos';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { HazardBadge } from '@/components/shared/hazard-badge';
import { formatDate, formatDistance, formatVelocity, formatDiameter } from '@/lib/utils/format';
import { ExternalLink, Ruler, Gauge, Circle, MoveRight, Moon } from 'lucide-react';

interface NeoDetailModalProps {
  neo: NEOApproach | null;
  open: boolean;
  onClose: () => void;
}

export function NeoDetailModal({ neo, open, onClose }: NeoDetailModalProps) {
  const lunarDistancePercent = neo ? Math.min((neo.missDistanceLunar / 10) * 100, 100) : 0;
  const sizeLabel = neo ? (neo.diameterMaxM >= 100 ? 'Large' : neo.diameterMaxM >= 30 ? 'Medium' : 'Small') : '';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] border-white/[0.08]" style={{ backgroundColor: '#0B1228' }}>
        {neo && <><DialogHeader>
          <DialogTitle className="text-lg text-white flex items-center gap-3">
            {neo.name}
            <HazardBadge hazardous={neo.hazardous} />
          </DialogTitle>
          <DialogDescription>
            Close approach on {formatDate(neo.closeApproachDate)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4 overflow-y-auto max-h-[65vh] pr-1">
          {/* Distance visualization */}
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Ruler className="h-3.5 w-3.5" />
              <span>Miss Distance</span>
            </div>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-white font-medium">{formatDistance(neo.missDistanceKm)}</span>
                <span className="text-muted-foreground">{neo.missDistanceLunar.toFixed(2)} Lunar distances</span>
              </div>
              {/* Visual distance bar: Earth → Asteroid */}
              <div className="relative h-8 rounded-full bg-space-800 overflow-hidden">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <div className="h-4 w-4 rounded-full bg-nebula-blue" title="Earth" />
                  <span className="text-[9px] text-muted-foreground">Earth</span>
                </div>
                {neo.missDistanceLunar <= 10 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1"
                    style={{ left: `${Math.max(15, Math.min(lunarDistancePercent, 92))}%` }}
                  >
                    <div className={`h-3 w-3 rounded-full ${neo.hazardous ? 'bg-status-danger' : 'bg-status-safe'}`} title="Asteroid" />
                  </div>
                )}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Moon className="h-3 w-3 text-muted-foreground/40" />
                </div>
                {/* Moon distance marker */}
                <div className="absolute top-0 bottom-0 border-l border-dashed border-white/10" style={{ left: '10%' }} />
              </div>
              <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
                <span>0</span>
                <span>1 LD (384,400 km)</span>
                <span>10 LD</span>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                <Gauge className="h-3 w-3" />
                Velocity
              </div>
              <p className="text-sm font-semibold text-white">{formatVelocity(neo.velocityKph)}</p>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                <Circle className="h-3 w-3" />
                Diameter ({sizeLabel})
              </div>
              <p className="text-sm font-semibold text-white">{formatDiameter(neo.diameterMinM, neo.diameterMaxM)}</p>
            </div>
          </div>

          {/* Size comparison */}
          <div className="glass-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Size comparison</p>
            <div className="flex items-end gap-4">
              <div className="text-center">
                <div className="mx-auto bg-muted-foreground/20 rounded-full" style={{ width: 8, height: 8 }} />
                <p className="text-[9px] text-muted-foreground mt-1">Car (2m)</p>
              </div>
              <div className="text-center">
                <div className="mx-auto bg-muted-foreground/20 rounded-full" style={{ width: 16, height: 16 }} />
                <p className="text-[9px] text-muted-foreground mt-1">House (10m)</p>
              </div>
              <div className="text-center">
                <div
                  className={`mx-auto rounded-full ${neo.hazardous ? 'bg-status-danger/40' : 'bg-nebula-cyan/40'}`}
                  style={{
                    width: Math.max(6, Math.min(neo.diameterMaxM / 3, 60)),
                    height: Math.max(6, Math.min(neo.diameterMaxM / 3, 60)),
                  }}
                />
                <p className="text-[9px] text-white mt-1 font-medium">{neo.name}</p>
                <p className="text-[9px] text-muted-foreground">{formatDiameter(neo.diameterMinM, neo.diameterMaxM)}</p>
              </div>
              <div className="text-center">
                <div className="mx-auto bg-muted-foreground/20 rounded-full" style={{ width: 32, height: 32 }} />
                <p className="text-[9px] text-muted-foreground mt-1">Statue of Liberty (93m)</p>
              </div>
            </div>
          </div>

          <a
            href={neo.nasaJplUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-nebula-blue hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on NASA JPL
          </a>
        </div></>}
      </DialogContent>
    </Dialog>
  );
}
