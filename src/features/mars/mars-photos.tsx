'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SectionContainer } from '@/components/layout/section-container';
import { SectionHeader } from '@/components/shared/section-header';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Camera } from 'lucide-react';

interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  camera: { name: string; full_name: string };
  rover: { name: string };
}

export function MarsPhotos() {
  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [selected, setSelected] = useState<MarsPhoto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/mars-photos');
        if (!res.ok) { setLoading(false); return; }
        const data = await res.json();
        if (mounted && data.success && data.data) setPhotos(data.data.slice(0, 8));
      } catch { /* ignore */ }
      if (mounted) setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <SectionContainer id="mars">
        <SectionHeader title="Mars Rover" description="Latest photos from the surface of Mars" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card overflow-hidden"><div className="shimmer-bg aspect-square w-full" /></div>
          ))}
        </div>
      </SectionContainer>
    );
  }

  if (photos.length === 0) return null;

  return (
    <SectionContainer id="mars">
      <SectionHeader title="Mars Rover" description="Latest photos from the surface of Mars" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <button key={photo.id} onClick={() => setSelected(photo)} className="glass-card glass-card-hover overflow-hidden text-left">
            <div className="relative aspect-square w-full">
              <Image src={photo.img_src} alt={`Mars - ${photo.camera.full_name}`} fill className="object-cover" sizes="25vw" unoptimized />
            </div>
            <div className="p-2">
              <p className="text-[10px] text-white font-medium truncate">{photo.camera.full_name}</p>
              <p className="text-[9px] text-muted-foreground">{photo.rover.name} &middot; {photo.earth_date}</p>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl border-white/[0.08]" style={{ backgroundColor: '#0B1228' }}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  {selected.camera.full_name}
                </DialogTitle>
                <DialogDescription>
                  {selected.rover.name} Rover &middot; {selected.earth_date}
                  <Badge variant="outline" className="ml-2 text-[10px]">{selected.camera.name}</Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image src={selected.img_src} alt={selected.camera.full_name} fill className="object-contain" sizes="768px" unoptimized />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SectionContainer>
  );
}
