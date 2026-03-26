'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useApod } from '@/hooks/use-apod';
import { HeroSkeleton } from '@/components/states/loading-skeleton';
import { ErrorState } from '@/components/states/error-state';
import { StaleIndicator } from '@/components/shared/stale-indicator';
import { RefreshButton } from '@/components/shared/refresh-button';
import { queryKeys } from '@/lib/query/query-keys';
import { truncateText, formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ApodVideoPlayer } from '@/components/shared/apod-video-player';
import { ShareButton } from '@/components/shared/share-button';
import { Calendar, ExternalLink, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export function ApodHero() {
  const { data: response, isLoading, isError, error } = useApod();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) return <HeroSkeleton />;
  if (isError || !response?.success || !response.data) {
    return (
      <ErrorState
        title="Failed to load Astronomy Picture of the Day"
        message={error?.message ?? response?.error ?? undefined}
      />
    );
  }

  const apod = response.data;
  const isStale = response.metadata.isStale;

  return (
    <>
      <motion.div
        className="relative overflow-hidden rounded-xl glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full">
          {apod.mediaType === 'image' && apod.imageUrl ? (
            <Image
              src={apod.imageUrl}
              alt={apod.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-space-900">
              <div className="text-center">
                <Play className="mx-auto mb-3 h-16 w-16 text-nebula-blue/60" />
                <p className="text-sm text-muted-foreground">Video content available</p>
              </div>
            </div>
          )}
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(apod.date)}
                </div>
                {isStale && <StaleIndicator />}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                {apod.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                {truncateText(apod.explanation, 200)}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(true)}
                  className="gap-2"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Read More
                </Button>
                <ShareButton title={`APOD: ${apod.title}`} text={apod.explanation.slice(0, 100)} />
              </div>
            </div>
            <RefreshButton queryKey={queryKeys.apod.root} label="Refresh APOD" />
          </div>
        </div>
      </motion.div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] bg-space-900 border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">{apod.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {formatDate(apod.date)}
              {apod.copyright && <span> &mdash; {apod.copyright}</span>}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {apod.mediaType === 'image' && apod.imageUrl && (
              <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={apod.hdImageUrl ?? apod.imageUrl}
                  alt={apod.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                  unoptimized
                />
              </div>
            )}
            {apod.mediaType === 'video' && apod.videoUrl && (
              <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
                <ApodVideoPlayer url={apod.videoUrl} title={apod.title} />
              </div>
            )}
            <p className="text-sm leading-relaxed text-white/80">{apod.explanation}</p>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
