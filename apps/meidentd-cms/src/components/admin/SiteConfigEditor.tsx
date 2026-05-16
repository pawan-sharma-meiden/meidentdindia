'use client';

import { useState, useEffect } from 'react';
import {
  Save, Loader2, CheckCircle, AlertTriangle, RefreshCw,
  Globe, Phone, FileText, Shield, Home, Newspaper,
  Plus, Trash2, Eye, EyeOff, Link2, ChevronRight, ChevronDown,
} from 'lucide-react';

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function Field({
  label, value, onChange, textarea = false,
  rows = 4, mono = false, placeholder = '',
}: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; rows?: number; mono?: boolean; placeholder?: string;
}) {
  const cls = `w-full px-4 py-3 bg-[#0b1120] border border-white/10 rounded-lg
    focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none
    transition-all text-sm text-white placeholder-slate-700
    ${mono ? 'font-mono' : 'font-sans'}`;
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
        {label}
      </label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)}
            rows={rows} placeholder={placeholder} className={`${cls} resize-y`} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

function SubPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-[#0b1120]/60 border border-white/5 overflow-hidden">
      <div className="px-4 py-2.5 bg-white/5 border-b border-white/5">
        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

// deep-clone helper used by all editors
const clone = (d: any) => structuredClone(d);

// ─── Footer Editor ────────────────────────────────────────────────────────────

function FooterEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (path: string, value: any) => {
    const parts = path.split('.');
    const copy = clone(data);
    let node = copy;
    for (let i = 0; i < parts.length - 1; i++) node = node[parts[i]];
    node[parts[parts.length - 1]] = value;
    onChange(copy);
  };

  return (
    <div className="space-y-6">
      <SubPanel title="Company Description">
        <Field label="Description" value={data.description ?? ''} onChange={v => set('description', v)} textarea rows={3} />
      </SubPanel>

      <SubPanel title="Headquarters">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Address" value={data.headquarters?.address ?? ''} onChange={v => set('headquarters.address', v)} textarea rows={2} />
          <div className="space-y-4">
            <Field label="Phone" value={data.headquarters?.phone ?? ''} onChange={v => set('headquarters.phone', v)} mono />
            <Field label="Email" value={data.headquarters?.email ?? ''} onChange={v => set('headquarters.email', v)} mono />
          </div>
        </div>
      </SubPanel>

      <SubPanel title="Bottom Bar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Copyright Name"    value={data.bottomBar?.copyrightName  ?? ''} onChange={v => set('bottomBar.copyrightName',  v)} />
          <Field label="Global Site Label" value={data.bottomBar?.globalSiteLabel ?? ''} onChange={v => set('bottomBar.globalSiteLabel', v)} />
          <Field label="Global Site URL"   value={data.bottomBar?.globalSiteUrl   ?? ''} onChange={v => set('bottomBar.globalSiteUrl',   v)} mono />
        </div>
      </SubPanel>

      {data.columns?.map((col: any, ci: number) => (
        <SubPanel key={ci} title={`Nav Column — ${col.title}`}>
          <Field label="Column Title" value={col.title ?? ''} onChange={v => {
            const copy = clone(data); copy.columns[ci].title = v; onChange(copy);
          }} />
          <div className="space-y-3 mt-2">
            {col.links?.map((link: any, li: number) => (
              <div key={li} className="flex items-start gap-3 p-3 bg-[#0f1629] rounded-lg border border-white/5">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Field label="Label" value={link.label ?? ''} onChange={v => {
                    const copy = clone(data); copy.columns[ci].links[li].label = v; onChange(copy);
                  }} />
                  <Field label="Href" value={link.href ?? ''} mono onChange={v => {
                    const copy = clone(data); copy.columns[ci].links[li].href = v; onChange(copy);
                  }} />
                </div>
                <div className="flex flex-col items-center gap-1 pt-6">
                  <label className="text-[10px] font-mono text-slate-500">Ext</label>
                  <input type="checkbox" checked={link.external ?? false} className="accent-blue-500 w-4 h-4"
                    onChange={e => { const copy = clone(data); copy.columns[ci].links[li].external = e.target.checked; onChange(copy); }} />
                </div>
                <button onClick={() => {
                  const copy = clone(data); copy.columns[ci].links.splice(li, 1); onChange(copy);
                }} className="mt-6 p-1.5 text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={() => {
              const copy = clone(data); copy.columns[ci].links.push({ label: '', href: '', external: false }); onChange(copy);
            }} className="flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors">
              <Plus size={12} strokeWidth={3} /> ADD_LINK
            </button>
          </div>
        </SubPanel>
      ))}
    </div>
  );
}

// ─── Social Links Editor ──────────────────────────────────────────────────────

function SocialLinksEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <SubPanel title="Social Profiles">
      <Field label="LinkedIn"   value={data.linkedin  ?? ''} onChange={v => onChange({ ...data, linkedin:  v })} mono placeholder="https://linkedin.com/company/..." />
      <Field label="Twitter / X" value={data.twitter  ?? ''} onChange={v => onChange({ ...data, twitter:   v })} mono placeholder="https://twitter.com/..." />
      <Field label="Facebook"   value={data.facebook  ?? ''} onChange={v => onChange({ ...data, facebook:  v })} mono placeholder="https://facebook.com/..." />
      <Field label="YouTube"    value={data.youtube   ?? ''} onChange={v => onChange({ ...data, youtube:   v })} mono placeholder="https://youtube.com/..." />
    </SubPanel>
  );
}

// ─── Contact Us Editor ────────────────────────────────────────────────────────

function ContactUsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (path: string, value: any) => {
    const parts = path.split('.');
    const copy = clone(data);
    let node = copy;
    for (let i = 0; i < parts.length - 1; i++) node = node[parts[i]];
    node[parts[parts.length - 1]] = value;
    onChange(copy);
  };

  return (
    <div className="space-y-6">
      <SubPanel title="Hero Section">
        <Field label="Badge Text" value={data.hero?.badgeText ?? ''} onChange={v => set('hero.badgeText', v)} />
        <Field label="Heading"    value={data.hero?.heading   ?? ''} onChange={v => set('hero.heading',   v)} />
        <Field label="Subheading" value={data.hero?.subheading ?? ''} onChange={v => set('hero.subheading', v)} textarea rows={2} />
      </SubPanel>

      <SubPanel title="Headquarters Card">
        <Field label="Address" value={data.headquarters?.address ?? ''} onChange={v => set('headquarters.address', v)} textarea rows={3} />
        <Field label="Map URL" value={data.headquarters?.mapUrl  ?? ''} onChange={v => set('headquarters.mapUrl',  v)} mono />
      </SubPanel>

      <SubPanel title="Contact Panel">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Heading"  value={data.contactPanel?.heading  ?? ''} onChange={v => set('contactPanel.heading',  v)} />
          <Field label="Location" value={data.contactPanel?.location ?? ''} onChange={v => set('contactPanel.location', v)} />
          <Field label="Phone"    value={data.contactPanel?.phone    ?? ''} onChange={v => set('contactPanel.phone',    v)} mono />
          <Field label="Email"    value={data.contactPanel?.email    ?? ''} onChange={v => set('contactPanel.email',    v)} mono />
        </div>
        <Field label="Subheading" value={data.contactPanel?.subheading ?? ''} onChange={v => set('contactPanel.subheading', v)} textarea rows={2} />
      </SubPanel>

      <SubPanel title="Terms Modal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Heading"           value={data.termsModal?.heading           ?? ''} onChange={v => set('termsModal.heading',           v)} />
          <Field label="Subheading"        value={data.termsModal?.subheading        ?? ''} onChange={v => set('termsModal.subheading',        v)} />
        </div>
        <Field label="Compliance Notice" value={data.termsModal?.complianceNotice ?? ''} onChange={v => set('termsModal.complianceNotice', v)} textarea rows={2} />
        <div className="space-y-3">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Sections</p>
          {data.termsModal?.sections?.map((s: any, i: number) => (
            <div key={i} className="p-4 bg-[#0f1629] rounded-lg border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">SECTION_{i + 1}</span>
                <button onClick={() => {
                  const copy = clone(data); copy.termsModal.sections.splice(i, 1); onChange(copy);
                }} className="p-1 text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
              </div>
              <Field label="Title" value={s.title ?? ''} onChange={v => { const copy = clone(data); copy.termsModal.sections[i].title = v; onChange(copy); }} />
              <Field label="Body"  value={s.body  ?? ''} onChange={v => { const copy = clone(data); copy.termsModal.sections[i].body  = v; onChange(copy); }} textarea rows={3} />
            </div>
          ))}
          <button onClick={() => {
            const copy = clone(data); copy.termsModal.sections.push({ title: '', body: '' }); onChange(copy);
          }} className="flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors">
            <Plus size={12} strokeWidth={3} /> ADD_SECTION
          </button>
        </div>
      </SubPanel>
    </div>
  );
}

// ─── Legal Editor — Privacy Policy & Terms ────────────────────────────────────

function LegalEditor({ data, onChange, type }: {
  data: any; onChange: (d: any) => void; type: 'privacy_policy' | 'terms';
}) {
  if (type === 'terms') return (
    <div className="space-y-6">
      <SubPanel title="Metadata">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title"        value={data.title       ?? ''} onChange={v => onChange({ ...data, title:        v })} />
          <Field label="Last Updated" value={data.lastUpdated ?? ''} onChange={v => onChange({ ...data, lastUpdated: v })} mono placeholder="YYYY-MM-DD" />
        </div>
      </SubPanel>
      <SubPanel title="Introduction">
        <Field label="Introduction" value={data.introduction ?? ''} onChange={v => onChange({ ...data, introduction: v })} textarea rows={6} />
      </SubPanel>
      <SubPanel title="Sections">
        <div className="space-y-4">
          {data.sections?.map((s: any, i: number) => (
            <div key={i} className="p-4 bg-[#0f1629] rounded-lg border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">SECTION_{i + 1}</span>
                <button onClick={() => { const copy = clone(data); copy.sections.splice(i, 1); onChange(copy); }}
                  className="p-1 text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
              </div>
              <Field label="Title" value={s.title ?? ''} onChange={v => { const copy = clone(data); copy.sections[i].title = v; onChange(copy); }} />
              <Field label="Body"  value={s.body  ?? ''} onChange={v => { const copy = clone(data); copy.sections[i].body  = v; onChange(copy); }} textarea rows={6} />
            </div>
          ))}
          <button onClick={() => { const copy = clone(data); copy.sections.push({ title: '', body: '' }); onChange(copy); }}
            className="flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors">
            <Plus size={12} strokeWidth={3} /> ADD_SECTION
          </button>
        </div>
      </SubPanel>
    </div>
  );

  // privacy_policy — sections → subsections
  return (
    <div className="space-y-6">
      <SubPanel title="Metadata">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title"        value={data.title       ?? ''} onChange={v => onChange({ ...data, title:        v })} />
          <Field label="Last Updated" value={data.lastUpdated ?? ''} onChange={v => onChange({ ...data, lastUpdated: v })} mono placeholder="YYYY-MM-DD" />
        </div>
      </SubPanel>
      {data.sections?.map((sec: any, si: number) => (
        <SubPanel key={si} title={sec.heading ?? `Section ${si + 1}`}>
          <Field label="Section Heading" value={sec.heading ?? ''} onChange={v => {
            const copy = clone(data); copy.sections[si].heading = v; onChange(copy);
          }} />
          <div className="space-y-3 mt-4">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Subsections</p>
            {sec.subsections?.map((sub: any, ui: number) => (
              <div key={ui} className="p-4 bg-[#0f1629] rounded-lg border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">SUB_{ui + 1}</span>
                  <button onClick={() => {
                    const copy = clone(data); copy.sections[si].subsections.splice(ui, 1); onChange(copy);
                  }} className="p-1 text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                </div>
                <Field label="Title (leave blank for intro paragraph)" value={sub.title ?? ''} onChange={v => {
                  const copy = clone(data); copy.sections[si].subsections[ui].title = v || null; onChange(copy);
                }} />
                <Field label="Body" value={sub.body ?? ''} onChange={v => {
                  const copy = clone(data); copy.sections[si].subsections[ui].body = v; onChange(copy);
                }} textarea rows={5} />
              </div>
            ))}
            <button onClick={() => {
              const copy = clone(data); copy.sections[si].subsections.push({ title: '', body: '' }); onChange(copy);
            }} className="flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors">
              <Plus size={12} strokeWidth={3} /> ADD_SUBSECTION
            </button>
          </div>
        </SubPanel>
      ))}
    </div>
  );
}

// ─── Home Editor ──────────────────────────────────────────────────────────────

function HomeEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-6">
      <SubPanel title="Footer Note">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Footer Note"    value={data.footerNote ?? ''} onChange={v => onChange({ ...data, footerNote: v })} />
          <Field label="Copyright Text" value={data.copyright  ?? ''} onChange={v => onChange({ ...data, copyright:  v })} />
        </div>
      </SubPanel>
      <SubPanel title="Categories">
        <div className="space-y-4">
          {data.categories?.map((cat: any, i: number) => (
            <div key={i} className="p-4 bg-[#0f1629] rounded-lg border border-white/5 space-y-3">
              <span className="text-[10px] font-mono text-slate-500">CATEGORY_{i + 1}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Label"       value={cat.label       ?? ''} onChange={v => { const copy = clone(data); copy.categories[i].label       = v; onChange(copy); }} />
                <Field label="Description" value={cat.description ?? ''} onChange={v => { const copy = clone(data); copy.categories[i].description = v; onChange(copy); }} />
                <Field label="Image Path"  value={cat.image       ?? ''} onChange={v => { const copy = clone(data); copy.categories[i].image       = v; onChange(copy); }} mono />
                <Field label="Href"        value={cat.href        ?? ''} onChange={v => { const copy = clone(data); copy.categories[i].href        = v; onChange(copy); }} mono />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id={`cat-ext-${i}`} checked={cat.external ?? false} className="accent-blue-500 w-4 h-4"
                  onChange={e => { const copy = clone(data); copy.categories[i].external = e.target.checked; onChange(copy); }} />
                <label htmlFor={`cat-ext-${i}`} className="text-xs font-mono text-slate-400">External link</label>
              </div>
            </div>
          ))}
        </div>
      </SubPanel>
    </div>
  );
}

// ─── News Releases Editor ─────────────────────────────────────────────────────

const DETAIL_DEFAULTS: Record<string, any> = {
  text:        { type: 'text',        body: '' },
  pdf:         { type: 'pdf',         href: '', label: 'View Document' },
  image:       { type: 'image',       src:  '', alt: '' },
  maintenance: { type: 'maintenance', schedule: '', notes: [''] },
};

function NewsReleasesEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const setItem = (i: number, field: string, value: any) => {
    const copy = clone(data); copy.items[i][field] = value; onChange(copy);
  };
  const setDetail = (i: number, field: string, value: any) => {
    const copy = clone(data); copy.items[i].detail[field] = value; onChange(copy);
  };

  const addItem = () => {
    const id = `nr-${Date.now()}`;
    const copy = clone(data);
    copy.items.unshift({ id, date: new Date().toISOString().split('T')[0], category: 'Information',
      year: String(new Date().getFullYear()), title: '', published: false, detail: { type: 'text', body: '' } });
    onChange(copy);
    setExpandedId(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-slate-500">{data.items?.length ?? 0} ITEMS</p>
        <button onClick={addItem}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
          <Plus size={12} strokeWidth={3} /> NEW_RELEASE
        </button>
      </div>

      <div className="space-y-2">
        {data.items?.map((item: any, i: number) => {
          const open = expandedId === item.id;
          return (
            <div key={item.id} className="rounded-lg bg-[#0b1120]/60 border border-white/5 overflow-hidden">
              {/* Row */}
              <div className="flex items-center gap-3 px-4 py-3">
                <button onClick={() => setExpandedId(open ? null : item.id)} className="flex-1 flex items-center gap-3 text-left">
                  {open
                    ? <ChevronDown size={14} className="text-blue-400 shrink-0" />
                    : <ChevronRight size={14} className="text-slate-500 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.title || <span className="text-slate-500 italic">Untitled</span>}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-500">{item.date}</span>
                      <span className="text-[10px] font-mono text-slate-600 uppercase">{item.detail?.type}</span>
                      {item.published
                        ? <span className="text-[10px] font-mono text-emerald-500">● LIVE</span>
                        : <span className="text-[10px] font-mono text-slate-600">● DRAFT</span>}
                    </div>
                  </div>
                </button>
                {/* publish toggle */}
                <button onClick={() => setItem(i, 'published', !item.published)} title={item.published ? 'Unpublish' : 'Publish'}
                  className={`p-1.5 rounded transition-colors ${item.published ? 'text-emerald-400 hover:text-slate-400' : 'text-slate-600 hover:text-emerald-400'}`}>
                  {item.published ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => { const copy = clone(data); copy.items.splice(i, 1); onChange(copy); }}
                  className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>

              {/* Expanded */}
              {open && (
                <div className="px-4 pb-5 pt-4 border-t border-white/5 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Date"     value={item.date     ?? ''} onChange={v => setItem(i, 'date',     v)} mono placeholder="YYYY-MM-DD" />
                    <Field label="Year"     value={item.year     ?? ''} onChange={v => setItem(i, 'year',     v)} mono />
                    <Field label="Category" value={item.category ?? ''} onChange={v => setItem(i, 'category', v)} />
                  </div>
                  <Field label="Title" value={item.title ?? ''} onChange={v => setItem(i, 'title', v)} textarea rows={2} />

                  {/* Detail type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">Detail Type</label>
                    <div className="flex gap-2">
                      {['text', 'pdf', 'image', 'maintenance'].map(t => (
                        <button key={t} onClick={() => { const copy = clone(data); copy.items[i].detail = clone(DETAIL_DEFAULTS[t]); onChange(copy); }}
                          className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors
                            ${item.detail?.type === t
                              ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>
                          {t.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detail fields */}
                  {item.detail?.type === 'text' && (
                    <Field label="Body" value={item.detail.body ?? ''} onChange={v => setDetail(i, 'body', v)} textarea rows={4} />
                  )}
                  {item.detail?.type === 'pdf' && (
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="PDF URL"      value={item.detail.href  ?? ''} onChange={v => setDetail(i, 'href',  v)} mono />
                      <Field label="Button Label" value={item.detail.label ?? ''} onChange={v => setDetail(i, 'label', v)} />
                    </div>
                  )}
                  {item.detail?.type === 'image' && (
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Image URL" value={item.detail.src ?? ''} onChange={v => setDetail(i, 'src', v)} mono />
                      <Field label="Alt Text"  value={item.detail.alt ?? ''} onChange={v => setDetail(i, 'alt', v)} />
                    </div>
                  )}
                  {item.detail?.type === 'maintenance' && (
                    <div className="space-y-4">
                      <Field label="Schedule" value={item.detail.schedule ?? ''} onChange={v => setDetail(i, 'schedule', v)} />
                      <div className="space-y-2">
                        <label className="block text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">Notes</label>
                        {item.detail.notes?.map((note: string, ni: number) => (
                          <div key={ni} className="flex gap-2">
                            <input type="text" value={note}
                              onChange={e => { const copy = clone(data); copy.items[i].detail.notes[ni] = e.target.value; onChange(copy); }}
                              className="flex-1 px-4 py-2 bg-[#0b1120] border border-white/10 rounded-lg text-sm text-white font-sans outline-none focus:border-blue-500/50" />
                            <button onClick={() => { const copy = clone(data); copy.items[i].detail.notes.splice(ni, 1); onChange(copy); }}
                              className="p-2 text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                          </div>
                        ))}
                        <button onClick={() => { const copy = clone(data); copy.items[i].detail.notes.push(''); onChange(copy); }}
                          className="flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors">
                          <Plus size={12} strokeWidth={3} /> ADD_NOTE
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Key registry ─────────────────────────────────────────────────────────────

type ConfigKey = 'footer' | 'social_links' | 'contact_us' | 'privacy_policy' | 'terms' | 'home' | 'news_releases';

const KEYS = [
  { key: 'footer',          label: 'Footer',          icon: Globe,      desc: 'Links, HQ, copyright'   },
  { key: 'social_links',    label: 'Social Links',    icon: Link2,      desc: 'LinkedIn, Twitter…'      },
  { key: 'contact_us',      label: 'Contact Us',      icon: Phone,      desc: 'Hero, form, modal'       },
  { key: 'privacy_policy',  label: 'Privacy Policy',  icon: Shield,     desc: 'Sections & subsections'  },
  { key: 'terms',           label: 'Terms of Use',    icon: FileText,   desc: 'Intro & sections'        },
  { key: 'home',            label: 'Home Page',       icon: Home,       desc: 'Categories, note'        },
  { key: 'news_releases',   label: 'News Releases',   icon: Newspaper,  desc: 'Add, edit, publish'      },
] as const;

// ─── Main component ───────────────────────────────────────────────────────────

export default function SiteConfigEditor() {
  const [selectedKey, setSelectedKey] = useState<ConfigKey>('footer');
  const [configData,  setConfigData]  = useState<any>(null);
  const [loading,     setLoading]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [status,      setStatus]      = useState<'idle' | 'success' | 'error'>('idle');
  const [fetchError,  setFetchError]  = useState('');

  const fetchConfig = async (key: ConfigKey) => {
    setLoading(true); setFetchError(''); setConfigData(null);
    try {
      const res = await fetch(`/api/site-config/${key}`);
      if (!res.ok) throw new Error();
      setConfigData(await res.json());
    } catch {
      setFetchError(`Failed to load '${key}'`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(selectedKey); }, [selectedKey]);

  const handleSave = async () => {
    setSaving(true); setStatus('idle');
    try {
      const res = await fetch(`/api/site-config/${selectedKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const meta = KEYS.find(k => k.key === selectedKey)!;

  const renderEditor = () => {
    if (!configData) return null;
    switch (selectedKey) {
      case 'footer':         return <FooterEditor        data={configData} onChange={setConfigData} />;
      case 'social_links':   return <SocialLinksEditor   data={configData} onChange={setConfigData} />;
      case 'contact_us':     return <ContactUsEditor     data={configData} onChange={setConfigData} />;
      case 'privacy_policy': return <LegalEditor         data={configData} onChange={setConfigData} type="privacy_policy" />;
      case 'terms':          return <LegalEditor         data={configData} onChange={setConfigData} type="terms" />;
      case 'home':           return <HomeEditor          data={configData} onChange={setConfigData} />;
      case 'news_releases':  return <NewsReleasesEditor  data={configData} onChange={setConfigData} />;
    }
  };

  return (
    <div className="flex gap-6 h-full min-h-0">

      {/* Key selector */}
      <div className="w-52 shrink-0 space-y-1">
        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Config Keys</p>
        {KEYS.map(({ key, label, icon: Icon, desc }) => {
          const active = selectedKey === key;
          return (
            <button key={key} onClick={() => setSelectedKey(key as ConfigKey)}
              className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-all border
                ${active
                  ? 'bg-blue-500/10 border-blue-500/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.08)]'
                  : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Icon size={15} className={`mt-0.5 shrink-0 ${active ? 'text-blue-400' : 'text-slate-600'}`} />
              <div className="min-w-0">
                <p className={`text-xs truncate ${active ? 'font-semibold text-white' : 'font-medium'}`}>{label}</p>
                <p className="text-[10px] text-slate-600 truncate font-mono">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Editor panel */}
      <div className="flex-1 min-w-0 flex flex-col gap-4 min-h-0">

        {/* Toolbar */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <meta.icon size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wide">{meta.label}</h2>
              <p className="text-[10px] text-slate-500 font-mono">KEY: {selectedKey}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchConfig(selectedKey)} disabled={loading}
              className="p-2 text-slate-500 hover:text-white transition-colors" title="Reload">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            {status === 'success' && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <CheckCircle size={13} /> SAVED
              </span>
            )}
            {status === 'error' && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-red-400">
                <AlertTriangle size={13} /> FAILED
              </span>
            )}
            <button onClick={handleSave} disabled={saving || loading || !configData}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold text-white
                bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg transition-all
                hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {saving ? 'SAVING...' : 'SAVE_CONFIG'}
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 pb-4">
          {loading && (
            <div className="flex items-center justify-center h-48 gap-3 text-slate-500">
              <Loader2 size={18} className="animate-spin text-blue-400" />
              <span className="text-xs font-mono">LOADING_CONFIG...</span>
            </div>
          )}
          {fetchError && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300">
              <AlertTriangle size={16} />
              <span className="text-xs font-mono">{fetchError}</span>
            </div>
          )}
          {!loading && !fetchError && renderEditor()}
        </div>
      </div>
    </div>
  );
}