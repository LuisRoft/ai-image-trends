import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import HeaderDev from '@/components/header-dev';
import ConvexClientProvider from './ConvexClientProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const BASE_URL = 'https://vizai.luisroftl.me';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'VizAI - Biblioteca de Prompts y Generador de Imágenes AI',
    template: '%s | VizAI',
  },
  description:
    'Explora y edita los prompts mas populares del momento para transformar tus fotos en estilos únicos (anime, cartoon, realista y más). Genera imágenes al instante o guarda tus favoritos. Powered by AI.',
  keywords: [
    'AI prompts',
    'biblioteca de prompts',
    'generador de imágenes IA',
    'anime AI',
    'cartoon AI',
    'arte con inteligencia artificial',
    'prompts para imagen',
    'VizAI',
  ],
  authors: [{ name: 'LuisRoftl', url: 'https://luisroftl.me' }],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'VizAI - Biblioteca y Generador de Imágenes AI',
    description:
      'Convierte tus fotos en estilos sorprendentes con prompts listos para usar. Biblioteca gratis + generación de imágenes directa con IA.',
    url: BASE_URL,
    siteName: 'VizAI',
    images: [
      {
        url: `/api/og`,
        width: 1200,
        height: 630,
        alt: 'VizAI - Biblioteca y Generador de Imágenes AI',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VizAI - Biblioteca y Generador de Imágenes AI',
    description:
      'Convierte tus fotos en estilos sorprendentes con prompts listos para usar. Biblioteca gratis + generación de imágenes directa con IA.',
    images: [`/api/og`],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen`}
      >
        <div className="fixed left-0 top-0 -z-10 h-full w-full">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
          </div>
        </div>
        <div className="relative mx-auto h-screen w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <Analytics />
          <ClerkProvider
            afterSignOutUrl="/"
            appearance={{
              baseTheme: shadcn,
            }}
          >
            <ConvexClientProvider>
              <HeaderDev />
              {children}
            </ConvexClientProvider>
          </ClerkProvider>
        </div>
        <Toaster position="top-right" richColors closeButton />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'VizAI',
                url: 'https://vizai.luisroftl.me',
                description:
                  'Biblioteca de prompts y generador de imágenes con inteligencia artificial.',
                inLanguage: 'es',
                author: {
                  '@type': 'Person',
                  name: 'LuisRoftl',
                  url: 'https://luisroftl.me',
                },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate:
                      'https://vizai.luisroftl.me/?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'VizAI',
                url: 'https://vizai.luisroftl.me',
                applicationCategory: 'DesignApplication',
                operatingSystem: 'Web',
                description:
                  'Genera imágenes únicas con IA usando prompts optimizados. Transforma tus fotos en estilos anime, cartoon, realista y más.',
                inLanguage: 'es',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                featureList: [
                  'Biblioteca de prompts para IA',
                  'Generación de imágenes con inteligencia artificial',
                  'Estilos: anime, cartoon, realista, ilustración',
                  'Subida y procesamiento de imágenes propias',
                ],
              },
            ]),
          }}
        />
      </body>
    </html>
  );
}
