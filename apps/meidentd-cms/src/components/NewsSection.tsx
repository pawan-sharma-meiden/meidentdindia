'use client';

import { useState } from 'react';

const COLORS = { darkBlue: '#003366' };

type NewsDetailContent =
  | { type: 'text';        body: string; }
  | { type: 'image';       src: string; alt: string; }
  | { type: 'pdf';         href: string; label: string; }
  | { type: 'maintenance'; schedule: string; notes: string[]; };

interface NewsItem {
  id: string; date: string; category: string; title: string; year: string; published: boolean;
  detail: NewsDetailContent;
}

function DetailContent({ detail }: { detail: NewsDetailContent }) {
  if (detail.type === 'pdf') return (
    <a href={detail.href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
      style={{ backgroundColor: COLORS.darkBlue }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      {detail.label}
    </a>
  );
  if (detail.type === 'image') return (
    <img src={detail.src} alt={detail.alt} className="max-w-full border border-gray-200 shadow-sm" />
  );
  if (detail.type === 'maintenance') return (
    <div className="space-y-4 text-sm text-gray-700">
      <p>In order to perform system maintenance, accessing to our Web site will be suspended within the following period.</p>
      <div className="bg-gray-50 border border-gray-200 p-4">
        <p className="font-semibold mb-1">System maintenance schedule:</p>
        <p>{detail.schedule}</p>
      </div>
      <ul className="list-disc pl-5 space-y-1">{detail.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
      <p className="text-gray-500 italic">We apologize for any inconvenience caused by this.</p>
    </div>
  );
  if (detail.type === 'text') return <p className="text-gray-700 leading-relaxed">{detail.body}</p>;
  return null;
}

function NewsDetailPage({ item, onBack }: { item: NewsItem; onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <nav className="text-xs text-gray-500 mb-8 flex flex-wrap gap-1 items-center">
        <button onClick={onBack} className="hover:underline" style={{ color: COLORS.darkBlue }}>Home</button>
        <span>/</span>
        <button onClick={onBack} className="hover:underline" style={{ color: COLORS.darkBlue }}>News-Releases</button>
        <span>/</span>
        <span>{item.year}</span>
        <span>/</span>
        <span className="text-gray-700 truncate max-w-xs">{item.title}</span>
      </nav>
      <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: COLORS.darkBlue }}>News Releases {item.year}</p>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 leading-snug">{item.title}</h2>
      <p className="text-sm text-gray-500 mb-8">{item.date}</p>
      <hr className="border-gray-200 mb-8" />
      <blockquote className="border-l-4 pl-4 text-gray-700 italic mb-8" style={{ borderColor: COLORS.darkBlue }}>"{item.title}"</blockquote>
      <DetailContent detail={item.detail} />
      <div className="mt-12 pt-6 border-t border-gray-200">
        <button onClick={onBack} className="text-sm font-medium flex items-center gap-2 hover:underline" style={{ color: COLORS.darkBlue }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          News-Releases
        </button>
      </div>
    </div>
  );
}

function NewsListPage({ items, onSelect }: { items: NewsItem[]; onSelect: (id: string) => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="mb-8">
        <div className="flex gap-4 border-b border-gray-300 mb-6">
          <button className="pb-4 font-bold border-b-2" style={{ color: COLORS.darkBlue, borderColor: COLORS.darkBlue }}>News Releases</button>
        </div>
      </div>
      <div className="space-y-4">
        {items.map(item => (
          <button key={item.id} onClick={() => onSelect(item.id)}
            className="w-full text-left block p-4 border border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="flex gap-4">
              <div className="text-sm text-gray-500 min-w-max">{item.date}</div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">{item.category}</div>
                <div className="text-gray-900 text-sm leading-relaxed hover:underline">{item.title}</div>
              </div>
            </div>
          </button>
        ))}
        {items.length === 0 && <p className="text-gray-500 text-sm py-8 text-center">No news releases available.</p>}
      </div>
    </div>
  );
}

export default function NewsSection({ items }: { items: NewsItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeItem = items.find(i => i.id === activeId);

  if (activeItem) return <NewsDetailPage item={activeItem} onBack={() => setActiveId(null)} />;
  return <NewsListPage items={items} onSelect={setActiveId} />;
}