import Link from 'next/link';
import { getSiteConfig } from '@/lib/site-config';
import ScrollToTopButton from '@/components/ScrollToTopButton';

interface Subsection { title: string | null; body: string; isContactBlock?: boolean; }
interface Section    { heading: string; subsections: Subsection[]; }
interface PrivacyConfig {
  title: string;
  lastUpdated: string;
  sections: Section[];
}

// Renders body text: splits \n\n into <p> and detects numbered/bullet lists
function RenderBody({ text }: { text: string }) {
  const blocks = text.split('\n\n').filter(Boolean);
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter(Boolean);
        const isNumbered = lines.every(l => /^\d+\./.test(l.trim()));
        const isBullet   = lines.every(l => l.trim().startsWith('-'));
        if (isNumbered) return (
          <ol key={i} className="list-decimal list-inside text-gray-700 space-y-2 leading-relaxed">
            {lines.map((l, li) => <li key={li}>{l.replace(/^\d+\.\s*/, '')}</li>)}
          </ol>
        );
        if (isBullet) return (
          <ul key={i} className="list-disc list-inside text-gray-700 space-y-2">
            {lines.map((l, li) => <li key={li}>{l.replace(/^-\s*/, '')}</li>)}
          </ul>
        );
        return <p key={i} className="text-gray-700 leading-relaxed">{block}</p>;
      })}
    </div>
  );
}

export default async function PrivacyPolicyPage() {
  const config = await getSiteConfig<PrivacyConfig>('privacy_policy');

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-6 md:px-12 py-6 text-sm text-gray-600">
        <Link href="/" className="text-blue-700 hover:text-blue-900">Home</Link>
        <span className="mx-2">/</span>
        <span>{config?.title ?? 'Privacy Policy'}</span>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-12" style={{ color: '#113388' }}>
          {config?.title ?? 'Privacy Policy'}
        </h1>

        {config?.sections.map((section, si) => (
          <section key={si} className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#113388' }}>{section.heading}</h2>

            {section.subsections.map((sub, ui) => (
              <div key={ui} className="mb-6">
                {sub.title && (
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#113388' }}>{sub.title}</h3>
                )}
                {sub.isContactBlock ? (
                  <div className="bg-gray-50 p-6 rounded border border-gray-300">
                    <RenderBody text={sub.body} />
                  </div>
                ) : (
                  <RenderBody text={sub.body} />
                )}
              </div>
            ))}
          </section>
        ))}
      </div>

      <div className="fixed bottom-8 right-8">
        <ScrollToTopButton className="px-4 py-2 bg-gray-300 hover:bg-blue-700 text-gray-900 hover:text-white rounded transition-colors text-sm font-medium" />
        <span className="sr-only"> Top</span>
      </div>
    </div>
  );
}