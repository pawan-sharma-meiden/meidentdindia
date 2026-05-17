import { getSiteConfig } from '@/lib/site-config';
import ContactPageClient from '@/components/ContactPageClient';

export default async function ContactUsPage() {
  const config = await getSiteConfig('contact_us');

  // Graceful fallback so the page never crashes if DB is empty
  if (!config) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Contact page unavailable.</div>;
  }

  return <ContactPageClient config={config} />;
}