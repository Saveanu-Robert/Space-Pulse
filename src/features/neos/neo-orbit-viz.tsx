'use client';

import { useMemo } from 'react';
import type { NEOApproach } from '@/types/neos';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface NeoOrbitVizProps {
  approaches: NEOApproach[];
  onSelect: (neo: NEOApproach) => void;
}

export function NeoOrbitViz({ approaches, onSelect }: NeoOrbitVizProps) {
  const nearObjects = useMemo(() =>
    approaches
      .filter(a => a.missDistanceLunar <= 15)
      .sort((a, b) => a.missDistanceLunar - b.missDistanceLunar)
      .slice(0, 20),
    [approaches]
  );

  if (nearObjects.length === 0) return null;

  const maxLD = 15;
  const center = 150;
  const earthR = 12;
  const moonOrbitR = 40; // 1 LD
  const scale = (center - earthR - 10) / maxLD;

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-white mb-3">Orbital Proximity View</h3>
      <p className="text-[10px] text-muted-foreground mb-3">Near-Earth objects within 15 lunar distances</p>
      <div className="flex justify-center">
        <svg viewBox="0 0 300 300" className="w-full max-w-[300px] h-auto">
          {/* Background rings */}
          {[1, 5, 10, 15].map(ld => (
            <circle
              key={ld}
              cx={center} cy={center}
              r={ld * scale}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.5}
              strokeDasharray={ld === 1 ? '4,2' : undefined}
            />
          ))}

          {/* LD labels */}
          {[1, 5, 10].map(ld => (
            <text key={ld} x={center + ld * scale + 2} y={center - 3} fill="rgba(255,255,255,0.25)" fontSize="7">
              {ld} LD
            </text>
          ))}

          {/* Earth */}
          <circle cx={center} cy={center} r={earthR} fill="#3B82F6" opacity={0.8} />
          <text x={center} y={center + 3} textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">E</text>

          {/* Moon orbit */}
          <circle cx={center} cy={center} r={moonOrbitR} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} strokeDasharray="3,3" />
          <circle cx={center + moonOrbitR} cy={center} r={3} fill="rgba(255,255,255,0.4)" />

          {/* Asteroids */}
          {nearObjects.map((neo, i) => {
            const dist = neo.missDistanceLunar * scale;
            const angle = (i / nearObjects.length) * Math.PI * 2 - Math.PI / 2;
            const x = center + Math.cos(angle) * dist;
            const y = center + Math.sin(angle) * dist;
            const size = Math.max(2, Math.min(neo.diameterMaxM / 20, 6));
            const color = neo.hazardous ? '#EF4444' : '#06B6D4';

            return (
              <g key={`${neo.id}-${neo.closeApproachDate}`} className="cursor-pointer" onClick={() => onSelect(neo)}>
                <circle cx={x} cy={y} r={size + 4} fill="transparent" />
                <circle cx={x} cy={y} r={size} fill={color} opacity={0.7}>
                  <title>{neo.name}: {neo.missDistanceLunar.toFixed(1)} LD</title>
                </circle>
                <circle cx={x} cy={y} r={size + 2} fill="none" stroke={color} strokeWidth={0.5} opacity={0.3} />
              </g>
            );
          })}

          {/* Legend */}
          <circle cx={15} cy={280} r={4} fill="#06B6D4" opacity={0.7} />
          <text x={22} y={283} fill="rgba(255,255,255,0.5)" fontSize="7">Safe</text>
          <circle cx={55} cy={280} r={4} fill="#EF4444" opacity={0.7} />
          <text x={62} y={283} fill="rgba(255,255,255,0.5)" fontSize="7">Hazardous</text>
        </svg>
      </div>
    </div>
  );
}
