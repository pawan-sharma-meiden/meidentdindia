import Link from 'next/link';
import { getSiteConfig } from '@/lib/site-config';
import ScrollToTopButton from '@/components/ScrollToTopButton';

interface TermsSection { title: string; body: string; }
interface TermsConfig  { title: string; lastUpdated: string; introduction: string; sections: TermsSection[]; }

function RenderBody({ text }: { text: string }) {
  const blocks = text.split('\n\n').filter(Boolean);
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter(Boolean);
        const isNumbered = lines.every(l => /^\d+\./.test(l.trim()));
        const isBullet   = lines.every(l => l.trim().startsWith('-'));
        if (isNumbered) return (
          <ol key={i} className="list-decimal list-inside text-gray-700 space-y-2 leading-relaxed ml-2">
            {lines.map((l, li) => <li key={li}>{l.replace(/^\d+\.\s*/, '')}</li>)}
          </ol>
        );
        if (isBullet) return (
          <ul key={i} className="list-disc list-inside text-gray-700 space-y-2 ml-2">
            {lines.map((l, li) => <li key={li}>{l.replace(/^-\s*/, '')}</li>)}
          </ul>
        );
        return <p key={i} className="text-gray-700 leading-relaxed">{block}</p>;
      })}
    </div>
  );
}

export default async function TermsOfUsePage() {
  const config = await getSiteConfig<TermsConfig>('terms');

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-6 md:px-12 py-6 text-sm text-gray-600">
        <Link href="/" className="text-blue-700 hover:text-blue-900">Home</Link>
        <span className="mx-2">/</span>
        <span>{config?.title ?? 'Terms of Use'}</span>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-12" style={{ color: '#113388' }}>
          {config?.title ?? 'Terms of Use'}
        </h1>

        {config?.introduction && (
          <section className="mb-12">
            <RenderBody text={config.introduction} />
          </section>
        )}

        {config?.sections.map((section, i) => (
          <section key={i} className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#113388' }}>{section.title}</h2>
            <RenderBody text={section.body} />
          </section>
        ))}
      </div>

      <div className="fixed bottom-8 right-8">
        <ScrollToTopButton className="px-4 py-2 bg-gray-300 hover:bg-blue-700 text-gray-900 hover:text-white rounded transition-colors text-sm font-medium" />
      </div>
    </div>
  );
}