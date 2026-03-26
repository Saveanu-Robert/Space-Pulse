'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sun, Crosshair, Globe, Satellite, ImageIcon } from 'lucide-react';

const sections = [
  { id: 'space-weather', label: 'Weather', icon: Sun },
  { id: 'neos', label: 'NEOs', icon: Crosshair },
  { id: 'earth-events', label: 'Earth', icon: Globe },
  { id: 'mission-control', label: 'Control', icon: Satellite },
  { id: 'apod-gallery', label: 'Gallery', icon: ImageIcon },
];

export function SectionNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="hidden lg:flex items-center gap-1" aria-label="Section navigation">
      {sections.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
            active === id
              ? 'bg-white/[0.08] text-white'
              : 'text-muted-foreground hover:text-white hover:bg-white/[0.04]'
          )}
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </nav>
  );
}
