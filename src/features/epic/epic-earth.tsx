'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Globe2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface EpicImage {
  identifier: string;
  caption: string;
  date: string;
  image: string;
  url: string;
}

export function EpicEarth() {
  const [images, setImages] = useState<EpicImage[]>([]);
  const [selected, setSelected] = useState<EpicImage | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/epic');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data.success && data.data) setImages(data.data.slice(0, 4));
      } catch { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, []);

  if (images.length === 0) return null;

  return (
    <>
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe2 className="h-4 w-4 text-nebula-blue" />
          <h3 className="text-sm font-semibold text-white">Earth from Space</h3>
          <span className="text-[10px] text-muted-foreground ml-auto">DSCOVR EPIC</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {images.map((img) => (
            <button key={img.identifier} onClick={() => setSelected(img)} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image src={img.url} alt={img.caption} fill className="object-cover group-hover:scale-110 transition-transform" sizes="80px" unoptimized />
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg border-white/[0.08]" style={{ backgroundColor: '#0B1228' }}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">Earth — DSCOVR EPIC</DialogTitle>
                <DialogDescription>{selected.date}</DialogDescription>
              </DialogHeader>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Image src={selected.url} alt={selected.caption} fill className="object-contain" sizes="512px" unoptimized />
              </div>
              <p className="text-xs text-muted-foreground">{selected.caption}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
