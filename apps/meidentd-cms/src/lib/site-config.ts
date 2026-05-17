import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export function getSiteConfig<T = any>(key: string): Promise<T | null> {
  return unstable_cache(
    async () => {
      const config = await prisma.siteConfig.findUnique({ where: { key } });
      return (config?.data ?? null) as T | null;
    },
    [`site-config-${key}`],
    { tags: ['site-config', `site-config:${key}`] }
  )();
}