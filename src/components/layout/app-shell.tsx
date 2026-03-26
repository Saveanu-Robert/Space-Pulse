'use client';

import { TopNavbar } from './top-navbar';
import { Footer } from './footer';
import { ScrollToTop } from '@/components/shared/scroll-to-top';
import { ScrollProgress } from '@/components/shared/scroll-progress';
import { ToastContainer } from '@/components/shared/toast-container';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

export function AppShell({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavbar />
      <ScrollProgress />
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      <ToastContainer />
    </div>
  );
}
