'use client';

import { ApodHero } from '@/features/apod/apod-hero';
import { ApodGallery } from '@/features/apod/apod-gallery';
import { StatusBar } from './status-bar';
import { DigestCard } from './digest-card';
import { LiveStatsRow } from './live-stats-row';
import { DataFreshness } from './data-freshness';
import { SpaceWeatherSection } from '@/features/space-weather/space-weather-section';
import { NeoSection } from '@/features/neos/neo-section';
import { EarthEventsSection } from '@/features/earth-events/earth-events-section';
import { MarsPhotos } from '@/features/mars/mars-photos';
import { ISSTracker } from '@/features/iss/iss-tracker';
import { EpicEarth } from '@/features/epic/epic-earth';
import { ExoplanetStats } from '@/features/exoplanets/exoplanet-stats';
import { SectionContainer } from '@/components/layout/section-container';
import { SectionHeader } from '@/components/shared/section-header';
import { useEventNotifications } from '@/hooks/use-event-notifications';

export function DashboardContent() {
  useEventNotifications();

  return (
    <div className="space-y-2">
      {/* Hero: APOD */}
      <section className="pt-8">
        <ApodHero />
      </section>

      {/* Status bar + Digest */}
      <section className="pt-4 space-y-3">
        <StatusBar />
        <DigestCard />
      </section>

      {/* Live stats */}
      <section className="pt-2">
        <LiveStatsRow />
      </section>

      {/* Space Weather */}
      <SpaceWeatherSection />

      {/* Near-Earth Objects */}
      <NeoSection />

      {/* Earth Events */}
      <EarthEventsSection />

      {/* Mission Control — each panel is a direct grid child */}
      <SectionContainer id="mission-control">
        <SectionHeader title="Mission Control" description="Live telemetry, satellite imagery, and system status" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ISSTracker />
          <EpicEarth />
          <ExoplanetStats />
          <DataFreshness />
        </div>
      </SectionContainer>

      {/* Mars Rover Photos */}
      <MarsPhotos />

      {/* APOD Gallery */}
      <ApodGallery />
    </div>
  );
}
