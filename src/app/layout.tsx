import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#030014',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: 'Space Pulse — NASA Activity Dashboard',
  description:
    'Real-time NASA activity dashboard tracking space weather, near-Earth objects, astronomy pictures, and Earth events with live data.',
  keywords: ['NASA', 'space weather', 'asteroids', 'APOD', 'dashboard', 'solar flares', 'CME', 'near-earth objects'],
  authors: [{ name: 'Space Pulse' }],
  openGraph: {
    title: 'Space Pulse — NASA Activity Dashboard',
    description: 'Track solar flares, asteroids, and Earth events in real-time with NASA data.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Space Pulse — NASA Activity Dashboard',
    description: 'Track solar flares, asteroids, and Earth events in real-time with NASA data.',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
