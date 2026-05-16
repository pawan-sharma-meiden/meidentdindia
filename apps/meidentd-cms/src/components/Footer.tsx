import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ExternalLink, Linkedin, Twitter, Facebook } from 'lucide-react';
import { getSiteConfig } from '@/lib/site-config';
import ScrollToTopButton from './ScrollToTopButton';

interface FooterLink   { label: string; href: string; external: boolean; }
interface FooterColumn { title: string; links: FooterLink[]; }
interface FooterConfig {
  description: string;
  columns: FooterColumn[];
  headquarters: { address: string; phone: string; email: string; };
  bottomBar: { copyrightName: string; globalSiteLabel: string; globalSiteUrl: string; };
}
interface SocialConfig { linkedin: string; twitter: string; facebook: string; youtube: string; }

export default async function Footer() {
  const [footer, social] = await Promise.all([
    getSiteConfig<FooterConfig>('footer'),
    getSiteConfig<SocialConfig>('social_links'),
  ]);

  const currentYear = new Date().getFullYear();
  const columns    = footer?.columns      ?? [];
  const hq         = footer?.headquarters;
  const bottomBar  = footer?.bottomBar;

  return (
    <footer className="w-full bg-white text-gray-700 font-sans">

      <div className="container mx-auto px-6 md:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Company Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="block relative w-48 h-12">
              <Image src="/images/cmn_logo01.svg" alt="Meiden T&D India Logo" fill className="object-contain object-left" />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm font-light text-gray-600">
              {footer?.description}
            </p>
            <div className="flex items-center gap-4">
              {social?.linkedin && <SocialLink href={social.linkedin} icon={<Linkedin size={18} />} label="LinkedIn" />}
              {social?.twitter  && <SocialLink href={social.twitter}  icon={<Twitter  size={18} />} label="Twitter"  />}
              {social?.facebook && <SocialLink href={social.facebook} icon={<Facebook size={18} />} label="Facebook" />}
            </div>
          </div>

          {/* Dynamic nav columns */}
          {columns.map((col, ci) => (
            <div key={ci} className={`lg:col-span-2 ${ci === 0 ? 'lg:col-start-6' : ''}`}>
              <FooterHeader>{col.title}</FooterHeader>
              <ul className="space-y-3">
                {col.links.map((link, li) => (
                  <FooterLinkItem key={li} href={link.href} external={link.external}>
                    {link.label}
                  </FooterLinkItem>
                ))}
              </ul>
            </div>
          ))}

          {/* Headquarters */}
          {hq && (
            <div className="lg:col-span-3">
              <FooterHeader>Headquarters</FooterHeader>
              <div className="space-y-4 text-sm font-light">
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-700 mt-1 shrink-0" size={16} />
                  <span className="text-gray-700" style={{ whiteSpace: 'pre-line' }}>{hq.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-700 shrink-0" size={16} />
                  <a href={`tel:${hq.phone}`} className="text-gray-700 hover:text-blue-700 transition-colors">{hq.phone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-700 shrink-0" size={16} />
                  <a href={`mailto:${hq.email}`} className="text-gray-700 hover:text-blue-700 transition-colors">{hq.email}</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-300" style={{ backgroundColor: '#113388' }}>
        <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-medium text-gray-100 uppercase tracking-wide">
            <span>&copy; {currentYear} {bottomBar?.copyrightName ?? 'Meiden T&D (India) Ltd.'}</span>
            <span className="hidden md:block text-gray-400">|</span>
            <span>All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            {bottomBar?.globalSiteUrl && (
              <a href={bottomBar.globalSiteUrl} target="_blank" rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-blue-700 transition-colors">
                <span className="uppercase tracking-widest">{bottomBar.globalSiteLabel}</span>
                <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
              </a>
            )}
            <ScrollToTopButton className="p-2 bg-gray-300 hover:bg-blue-700 text-gray-900 hover:text-white rounded transition-colors" />
          </div>
        </div>
      </div>

    </footer>
  );
}

function FooterHeader({ children }: { children: React.ReactNode }) {
  return <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-6">{children}</h4>;
}

function FooterLinkItem({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <li>
      <Link href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
        className="text-sm text-gray-600 hover:text-blue-700 transition-colors">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 border border-gray-300 text-gray-700 hover:border-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300">
      {icon}
    </a>
  );
}