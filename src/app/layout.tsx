import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { BackgroundParticles } from '@/components/ui/BackgroundParticles';
import { PwaRegistry } from '@/components/layout/PwaRegistry';
import { ClientOnly } from '@/components/ClientOnly';

export const metadata: Metadata = {
  title: 'Baú Merengue — Aqui 2 é 1 | Sistema de Sorteio Digital',
  description: 'Sorteio digital festivo e transparente. Gerencie participantes, realize sorteios com animações dramáticas e histórico auditável.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFD700',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <PwaRegistry />
        <BackgroundParticles />
        <ClientOnly>
          <Header />
          <main className="min-h-screen pt-4 sm:pt-6 pb-16 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto w-full">
              {children}
            </div>
          </main>
        </ClientOnly>
      </body>
    </html>
  );
}
