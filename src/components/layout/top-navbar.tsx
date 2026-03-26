'use client';

import { Rocket } from 'lucide-react';
import { GlobalRefreshButton } from '@/components/shared/global-refresh-button';
import { LiveStatusBadge } from '@/components/shared/live-status-badge';
import { LastUpdatedBadge } from '@/components/shared/last-updated-badge';
import { SectionNav } from '@/components/shared/section-nav';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { FullscreenButton } from '@/components/shared/fullscreen-button';

export function TopNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-space-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-nebula-blue" />
            <span className="text-lg font-bold tracking-tight text-white">
              Space Pulse
            </span>
          </div>
          <div className="hidden sm:block">
            <LiveStatusBadge />
          </div>
          <SectionNav />
        </div>

        <div className="flex items-center gap-1.5">
          <LastUpdatedBadge />
          <ThemeToggle />
          <FullscreenButton />
          <GlobalRefreshButton />
        </div>
      </div>
    </header>
  );
}
