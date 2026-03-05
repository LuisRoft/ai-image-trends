import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generador de Imágenes AI',
  description:
    'Genera imágenes únicas con inteligencia artificial usando prompts optimizados. Personaliza estilos anime, cartoon, realista y más. Sube tu foto y transforma con IA.',
  alternates: {
    canonical: 'https://vizai.luisroftl.me/generator',
  },
  openGraph: {
    title: 'Generador de Imágenes AI | VizAI',
    description:
      'Genera imágenes únicas con inteligencia artificial usando prompts optimizados. Personaliza estilos anime, cartoon, realista y más.',
    url: 'https://vizai.luisroftl.me/generator',
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
