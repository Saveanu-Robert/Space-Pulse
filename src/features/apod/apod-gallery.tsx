'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useApodGallery } from '@/hooks/use-apod-gallery';
import { SectionContainer } from '@/components/layout/section-container';
import { SectionHeader } from '@/components/shared/section-header';
import { RefreshButton } from '@/components/shared/refresh-button';
import { ErrorState } from '@/components/states/error-state';
import { queryKeys } from '@/lib/query/query-keys';
import { formatDate, truncateText } from '@/lib/utils/format';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ApodVideoPlayer } from '@/components/shared/apod-video-player';
import { Calendar, Video, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOTION } from '@/lib/config/constants';
import type { APODSummary } from '@/types/apod';

export function ApodGallery() {
  const { data: response, isLoading } = useApodGallery();
  const [selected, setSelected] = useState<APODSummary | null>(null);

  if (isLoading) {
    return (
      <SectionContainer id="apod-gallery">
        <SectionHeader title="APOD Gallery" description="Recent Astronomy Pictures of the Day" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <div className="shimmer-bg aspect-[4/3] w-full" />
              <div className="p-3">
                <div className="shimmer-bg h-4 w-3/4 rounded mb-2" />
                <div className="shimmer-bg h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    );
  }

  if (!response?.success || !response.data || response.data.items.length === 0) {
    return null; // Don't show section if gallery fails — hero still works
  }

  const items = response.data.items;

  return (
    <SectionContainer id="apod-gallery">
      <SectionHeader title="APOD Gallery" description="Recent Astronomy Pictures of the Day">
        <RefreshButton queryKey={queryKeys.apod.gallery} label="Refresh gallery" />
      </SectionHeader>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        {...MOTION.staggerContainer}
      >
        {items.slice(1).map((item) => ( // skip first — it's the hero
          <motion.button
            key={item.date}
            className="glass-card glass-card-hover overflow-hidden text-left"
            onClick={() => setSelected(item)}
            variants={MOTION.staggerItem.variants}
          >
            <div className="relative aspect-[4/3] w-full">
              {item.mediaType === 'image' && item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-space-850">
                  <Video className="h-8 w-8 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-white line-clamp-2">{item.title}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Calendar className="h-2.5 w-2.5" />
                {formatDate(item.date)}
                {item.mediaType === 'video' && (
                  <Badge variant="outline" className="ml-auto text-[9px] px-1 py-0">Video</Badge>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] border-white/[0.08]" style={{ backgroundColor: '#0B1228' }}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg text-white">{selected.title}</DialogTitle>
                <DialogDescription>
                  {formatDate(selected.date)}
                  {selected.copyright && <span> &mdash; {selected.copyright}</span>}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                {selected.mediaType === 'image' && selected.imageUrl && (
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={selected.hdImageUrl ?? selected.imageUrl}
                      alt={selected.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 768px"
                      unoptimized
                    />
                  </div>
                )}
                {selected.mediaType === 'video' && selected.videoUrl && (
                  <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
                    <ApodVideoPlayer url={selected.videoUrl} title={selected.title} />
                  </div>
                )}
                <p className="text-sm leading-relaxed text-white/80">{selected.explanation}</p>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SectionContainer>
  );
}
