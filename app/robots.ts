import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { allow: '/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
