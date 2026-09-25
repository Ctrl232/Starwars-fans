import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from '@/components/providers/AppProviders';
import { AppHeader } from '@/components/layout/AppHeader';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Star Wars Fans · Personajes de la galaxia',
    template: '%s · Star Wars Fans',
  },
  description:
    'Explora los 82 personajes de Star Wars: sus películas, directores y los planetas que aparecen en cada una.',
  openGraph: { type: 'website', siteName: 'Star Wars Fans', locale: 'es_CO' },
};

export const viewport: Viewport = {
  themeColor: '#0B0D17',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppProviders>
          <a href="#main-content" className="skip-link">
            Saltar al contenido
          </a>
          <AppHeader />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
