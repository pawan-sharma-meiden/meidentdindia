import Link from 'next/link';
import { getSiteConfig } from '@/lib/site-config';
import HeroCarousel from '@/components/HeroCarousel';
import NewsSection from '@/components/NewsSection';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const COLORS = { white: '#ffffff', lightGray: '#f5f5f5', darkBlue: '#003366' };

interface Category { label: string; description: string; image: string; href: string; external: boolean; }
interface HomeConfig { footerNote: string; copyright: string; categories: Category[]; }
interface NewsItem {
  id: string; date: string; category: string; title: string; year: string; published: boolean;
  detail:
    | { type: 'text';        body: string; }
    | { type: 'image';       src: string; alt: string; }
    | { type: 'pdf';         href: string; label: string; }
    | { type: 'maintenance'; schedule: string; notes: string[]; };
}

export default async function HomePage() {
  const [home, newsConfig] = await Promise.all([
    getSiteConfig<HomeConfig>('home'),
    getSiteConfig<{ items: NewsItem[] }>('news_releases'),
  ]);

  const categories  = home?.categories ?? [];
  const publishedNews = (newsConfig?.items ?? []).filter(item => item.published);

  return (
    <main style={{ backgroundColor: COLORS.white }}>

      <HeroCarousel />

      <NewsSection items={publishedNews} />

      {/* Categories */}
      <div style={{ backgroundColor: COLORS.lightGray }} className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((cat, i) => {
              const El = cat.external ? 'a' : Link;
              const props = cat.external
                ? { href: cat.href, target: '_blank', rel: 'noopener noreferrer' }
                : { href: cat.href };
              return (
                <El key={i} {...(props as any)} className="group block overflow-hidden hover:opacity-80 transition-opacity">
                  <div className="mb-4">
                    <img src={cat.image} alt={cat.label} className="w-full h-64 object-cover" />
                  </div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold" style={{ color: COLORS.darkBlue }}>{cat.label}</h3>
                    <img src="/images/meidensha-icon.png" alt="" className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{cat.description}</p>
                </El>
              );
            })}
          </div>
        </div>
      </div>

      <ScrollToTopButton className="fixed bottom-8 right-8 bg-white border border-gray-400 text-gray-700 px-4 py-2 text-sm font-bold hover:bg-gray-100 transition-colors" />

      <div style={{ backgroundColor: COLORS.lightGray }} className="text-center py-8 text-xs text-gray-600">
        <p>{home?.footerNote ?? 'Meiden T&D India Limited'}</p>
        <p className="mt-2">{home?.copyright ?? 'Copyright © MEIDEN T&D (INDIA) LIMITED All rights reserved.'}</p>
      </div>

    </main>
  );
}