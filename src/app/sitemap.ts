import type { MetadataRoute } from 'next';

import { getPageIndex, getProducts } from '@/lib/api';
import { SITE_URL } from '@/lib/site';

// Siempre generado en el servidor con datos cacheados (no se congela en el build)
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, products] = await Promise.all([getPageIndex(), getProducts()]);
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/productos`, changeFrequency: 'weekly', priority: 0.9 },
    ...products.map((p) => ({ url: `${SITE_URL}/productos/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...pages
      .filter((p) => p.slug !== 'home')
      .map((p) => ({
        url: `${SITE_URL}/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at + 'Z') : undefined,
        changeFrequency: 'monthly' as const,
        priority: p.kind === 'legal' ? 0.3 : 0.7,
      })),
  ];
}
