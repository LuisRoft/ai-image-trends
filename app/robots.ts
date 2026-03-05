import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

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
