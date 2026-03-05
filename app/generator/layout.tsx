import type { Metadata } from 'next';

const BASE_URL =
  process.env.SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

export const metadata: Metadata = {
  title: 'Generador de Imágenes AI',
  description:
    'Genera imágenes únicas con inteligencia artificial usando prompts optimizados. Personaliza estilos anime, cartoon, realista y más. Sube tu foto y transforma con IA.',
  alternates: {
    ...(BASE_URL && { canonical: `${BASE_URL}/generator` }),
  },
  openGraph: {
    title: 'Generador de Imágenes AI | VizAI',
    description:
      'Genera imágenes únicas con inteligencia artificial usando prompts optimizados. Personaliza estilos anime, cartoon, realista y más.',
    ...(BASE_URL && { url: `${BASE_URL}/generator` }),
    type: 'website',
    images: [
      {
        url: `/api/og?title=Generador+de+Im%C3%A1genes+AI&description=Transforma+tus+fotos+en+estilos+%C3%BAnicos+con+IA.+Anime%2C+cartoon%2C+realista+y+m%C3%A1s.`,
        width: 1200,
        height: 630,
        alt: 'Generador de Imágenes AI | VizAI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generador de Imágenes AI | VizAI',
    description:
      'Genera imágenes únicas con inteligencia artificial usando prompts optimizados.',
    images: [
      `/api/og?title=Generador+de+Im%C3%A1genes+AI&description=Transforma+tus+fotos+en+estilos+%C3%BAnicos+con+IA.+Anime%2C+cartoon%2C+realista+y+m%C3%A1s.`,
    ],
  },
};

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
