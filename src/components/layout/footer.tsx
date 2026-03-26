import { Rocket, ExternalLink, Globe, Shield, Zap, Radio, Satellite } from 'lucide-react';

const apiSources = [
  { name: 'APOD', desc: 'Astronomy Picture of the Day', url: 'https://apod.nasa.gov/apod/' },
  { name: 'DONKI', desc: 'Space Weather Database', url: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/' },
  { name: 'NeoWs', desc: 'Near-Earth Object Tracker', url: 'https://cneos.jpl.nasa.gov/' },
  { name: 'EONET', desc: 'Earth Natural Events', url: 'https://eonet.gsfc.nasa.gov/docs/v3' },
  { name: 'EPIC', desc: 'Earth Polychromatic Camera', url: 'https://epic.gsfc.nasa.gov/' },
  { name: 'Mars Rover', desc: 'Curiosity Raw Images', url: 'https://mars.nasa.gov/msl/multimedia/raw-images/' },
];

const quickLinks = [
  { label: 'Space Weather Prediction Center', url: 'https://www.swpc.noaa.gov/', icon: Zap },
  { label: 'NASA Asteroid Watch', url: 'https://eyes.nasa.gov/apps/asteroids/', icon: Shield },
  { label: 'SpaceWeatherLive', url: 'https://www.spaceweatherlive.com/', icon: Radio },
  { label: 'NASA Jet Propulsion Laboratory', url: 'https://www.jpl.nasa.gov/', icon: Rocket },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] mt-16 bg-space-950/50">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nebula-blue/10">
                <Rocket className="h-4 w-4 text-nebula-blue" />
              </div>
              <div>
                <span className="text-sm font-bold text-white">Space Pulse</span>
                <p className="text-[10px] text-muted-foreground">NASA Activity Dashboard</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground mb-4">
              Monitoring solar activity, tracking near-Earth objects, and visualizing global events
              with real-time data from NASA&apos;s open APIs. Designed for space enthusiasts,
              researchers, and anyone curious about what&apos;s happening beyond our atmosphere.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1 text-[10px]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-safe opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-safe" />
                </span>
                Live &mdash; refreshing every 60s
              </span>
            </div>
          </div>

          {/* NASA Data Sources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">
              NASA Data Sources
            </h3>
            <ul className="space-y-2.5">
              {apiSources.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 text-xs text-muted-foreground hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <span className="font-medium text-white/80 group-hover:text-white">{s.name}</span>
                      <span className="text-muted-foreground"> &mdash; {s.desc}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">
              Related Resources
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* How it works */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4">
              How It Works
            </h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <Satellite className="h-3.5 w-3.5 shrink-0 mt-0.5 text-nebula-cyan" />
                <span>Data fetched server-side from 6 NASA APIs with caching, retries, and circuit breakers</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-3.5 w-3.5 shrink-0 mt-0.5 text-nebula-violet" />
                <span>Validated with Zod schemas and normalized to clean domain models</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5 text-nebula-blue" />
                <span>Graceful degradation &mdash; one failed source never breaks the whole dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-3.5 w-3.5 shrink-0 mt-0.5 text-status-safe" />
                <span>Built with Next.js, TypeScript, Tailwind CSS, React Query, Recharts, and Leaflet</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground/50">
            &copy; {year} Space Pulse &mdash; Not affiliated with NASA. Data provided under NASA&apos;s Open Data policy.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground/50">
            <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors">
              Get a NASA API Key
            </a>
            <span>&middot;</span>
            <span>v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
