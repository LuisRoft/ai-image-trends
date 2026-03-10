import type { Metadata } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import GeneratorClient from './generator-client';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const BASE_DESCRIPTION =
  'Genera imágenes únicas con inteligencia artificial usando prompts optimizados. Personaliza estilos anime, cartoon, realista y más. Sube tu foto y transforma con IA.';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}): Promise<Metadata> {
  const { id } = await searchParams;

  if (!id) {
    return {
      title: 'Generador de Imágenes AI',
      description: BASE_DESCRIPTION,
    };
  }

  const prompt = await convex.query(api.prompts.getPromptById, { id });

  if (!prompt) {
    return {
      title: 'Prompt no encontrado',
      description: BASE_DESCRIPTION,
    };
  }

  const baseUrl =
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

  const ogUrl =
    `/api/og` +
    `?title=${encodeURIComponent(prompt.title)}` +
    `&description=${encodeURIComponent(prompt.description)}` +
    (prompt.previewUrl
      ? `&imageUrl=${encodeURIComponent(prompt.previewUrl)}`
      : '');

  return {
    title: prompt.title,
    description: prompt.description,
    openGraph: {
      title: `${prompt.title} | VizAI`,
      description: prompt.description,
      ...(baseUrl && { url: `${baseUrl}/generator?id=${id}` }),
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: prompt.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${prompt.title} | VizAI`,
      description: prompt.description,
      images: [ogUrl],
    },
  };
}

export default function GeneratorPage() {
  return <GeneratorClient />;
}
