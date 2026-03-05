import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vizai.luisroftl.me';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/generator', '/api/og'],
        disallow: ['/settings', '/api/generate-image', '/sign-in', '/sign-up'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
