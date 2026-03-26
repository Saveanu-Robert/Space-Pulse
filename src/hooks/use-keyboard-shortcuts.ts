'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';

const sections = ['space-weather', 'neos', 'earth-events', 'mission-control', 'apod-gallery'];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5': {
          const idx = parseInt(e.key, 10) - 1;
          const section = sections[idx];
          if (section) {
            document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
          }
          break;
        }
        case '0':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            queryClient.invalidateQueries({ queryKey: queryKeys.all });
          }
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [queryClient]);
}
