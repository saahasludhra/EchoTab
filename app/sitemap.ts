import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '', '/features', '/demo', '/docs', '/install', '/architecture',
    '/faq', '/roadmap', '/changelog', '/privacy', '/creator', '/contact',
  ];
  return pages.map((p) => ({
    url: `${siteConfig.url}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.7,
  }));
}
