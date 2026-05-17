'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, MapPin, Mail, CheckCircle, X, Loader2, Upload,
  ArrowRight, Building2, Briefcase, Info, Globe
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ContactUsConfig {
  hero: { badgeText: string; heading: string; subheading: string; };
  headquarters: { address: string; mapUrl: string; };
  contactPanel: { heading: string; subheading: string; phone: string; email: string; location: string; };
  termsModal: {
    heading: string;
    subheading: string;
    complianceNotice: string;
    sections: { title: string; body: string; }[];
  };
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

function useScrollLock() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.removeProperty('overflow'); };
  }, []);
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
    {children} {required && <span className="text-blue-600">*</span>}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full bg-white border border-slate-300 px-4 py-3 text-sm text-slate-900 font-sans focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-200 placeholder:text-slate-300 rounded-sm disabled:bg-slate-100 disabled:cursor-not-allowed" />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full bg-white border border-slate-300 px-4 py-3 text-sm text-slate-900 font-sans focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-200 placeholder:text-slate-300 rounded-sm resize-none" />
);

// ── Terms Modal ────────────────────────────────────────────────────────────────

function TermsModal({ isOpen, onClose, onAgree, config }: {
  isOpen: boolean; onClose: () => void; onAgree: () => void;
  config: ContactUsConfig['termsModal'];
}) {
  useScrollLock();
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 font-sans">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
        <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden border border-slate-200 z-10">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start shrink-0">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 uppercase tracking-tight">{config.heading}</h3>
              <p className="font-sans text-xs text-slate-500 mt-1">{config.subheading}</p>
            </div>
            <Info className="text-blue-600" size={24} />
          </div>
          <div className="flex-1 overflow-y-auto p-8 font-sans text-sm text-slate-600 leading-7 space-y-6">
            <div className="bg-blue-50/50 border-l-4 border-blue-600 p-4">
              <p className="font-bold text-blue-900 text-xs uppercase tracking-wider mb-1">Compliance Notice</p>
              <p className="text-blue-800/80 text-xs">{config.complianceNotice}</p>
            </div>
            {config.sections.map((s, i) => (
              <section key={i}>
                <h4 className="font-bold text-slate-900 mb-2">{s.title}</h4>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
          <div className="p-6 bg-white border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-4 shrink-0">
            <button onClick={onClose} className="px-6 py-3 text-slate-500 text-xs font-bold tracking-widest uppercase hover:bg-slate-50 rounded-sm transition-colors">Decline</button>
            <button onClick={onAgree} className="px-8 py-3 bg-blue-700 text-white text-xs font-bold tracking-widest uppercase hover:bg-blue-800 shadow-md rounded-sm transition-all">Accept & Continue</button>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}

// ── Contact Form Modal ─────────────────────────────────────────────────────────

function ContactFormModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  useScrollLock();
  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => { onClose(); setSuccess(false); }, 3000);
    }, 1500);
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-99999 flex items-center justify-center p-0 md:p-4 font-sans">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
          className="relative bg-white w-full max-w-6xl md:rounded-sm shadow-2xl flex flex-col md:flex-row h-dvh md:h-[85vh] overflow-hidden z-10">

          {/* Left panel */}
          <div className="hidden md:flex w-[350px] bg-slate-900 text-white flex-col justify-between shrink-0 relative overflow-hidden border-r border-slate-800">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="p-10 relative z-10">
              <div className="w-12 h-1 bg-blue-500 mb-8" />
              <h3 className="font-display text-3xl font-bold leading-tight mb-6">Engineering <br /> Connection</h3>
              <p className="font-sans text-slate-400 text-sm leading-relaxed">Direct channel to Meiden T&D India's specialized divisions.</p>
            </div>
            <div className="bg-slate-800 p-10 relative z-10 border-t border-slate-700">
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-1">Corporate HQ</p>
                  <p className="font-sans text-sm text-slate-300">Gurgaon, India</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="font-sans text-sm text-slate-300">info@meiden.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex flex-col h-full bg-white relative">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 z-20">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">Enquiry Portal</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Secure Connection</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-red-50 rounded-full transition-colors text-slate-400 hover:text-red-500"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 border border-green-100"><CheckCircle size={40} /></div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">Request Submitted</h3>
                  <p className="text-slate-500 font-sans">Your enquiry has been routed to the relevant department.</p>
                  <div className="mt-8 px-4 py-2 bg-slate-100 rounded text-xs font-mono text-slate-600">ID: MDN-{Math.floor(Math.random() * 99999)}</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 pb-4">
                  <div className="bg-slate-50/80 p-6 rounded-sm border border-slate-100">
                    <Label>Target Division</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <label className="cursor-pointer">
                        <input type="radio" name="dept" value="sales" className="peer sr-only" defaultChecked />
                        <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-sm peer-checked:border-blue-600 peer-checked:ring-1 peer-checked:ring-blue-600 transition-all shadow-sm">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-sm"><Briefcase size={20} /></div>
                          <div><span className="block font-bold text-slate-900 text-sm">Sales & Projects</span><span className="block text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">New Business</span></div>
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input type="radio" name="dept" value="purchase" className="peer sr-only" />
                        <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-sm peer-checked:border-blue-600 peer-checked:ring-1 peer-checked:ring-blue-600 transition-all shadow-sm">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-sm"><Building2 size={20} /></div>
                          <div><span className="block font-bold text-slate-900 text-sm">Vendor / Purchase</span><span className="block text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">Registration</span></div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><Label required>Company</Label><Input type="text" name="company" required placeholder="Organization Name" /></div>
                    <div><Label required>Full Name</Label><Input type="text" name="name" required placeholder="Name" /></div>
                    <div><Label required>Corporate Email</Label><Input type="email" name="email" required placeholder="email@company.com" /></div>
                    <div><Label required>Phone</Label><Input type="tel" name="phone" required placeholder="+91..." /></div>
                  </div>
                  <div><Label required>Project Requirements</Label><TextArea name="message" required rows={4} placeholder="Please describe technical specifications or requirements..." /></div>
                  <div>
                    <Label>Attachment</Label>
                    <div className="mt-2 border border-dashed border-slate-300 rounded-sm p-8 text-center hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer relative">
                      <input type="file" name="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
                      <Upload size={24} className="mx-auto text-slate-400 mb-3" />
                      <p className="text-sm font-medium text-slate-600">{fileName || 'Drag files here or click to browse'}</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">PDF, DOCX, XLSX (Max 10MB)</p>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {!success && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0 z-20">
                <button onClick={(e) => { const form = e.currentTarget.closest('.flex-col')?.querySelector('form'); form?.requestSubmit(); }}
                  disabled={loading}
                  className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-sm shadow-lg shadow-blue-700/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="animate-spin" /> : 'Submit Request'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </Portal>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function ContactPageClient({ config }: { config: ContactUsConfig }) {
  const [showTnc,  setShowTnc]  = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { hero, headquarters, contactPanel, termsModal } = config;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="relative w-full h-[50vh] min-h-[450px] bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-12">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/10 bg-white/5 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-white uppercase tracking-widest">{hero.badgeText}</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">{hero.heading}</h1>
            <p className="font-sans text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: hero.subheading }} />
          </motion.div>
        </div>
      </section>

      {/* Cards */}
      <section className="container max-w-6xl mx-auto px-6 pb-24 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* HQ card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-1 bg-white p-8 rounded-sm shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-sm flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <MapPin size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-4">Headquarters</h3>
            <p className="font-sans text-slate-500 leading-relaxed text-sm mb-6" style={{ whiteSpace: 'pre-line' }}>
              {headquarters.address}
            </p>
            <div className="mt-auto pt-6 border-t border-slate-50">
              <a href={headquarters.mapUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-700 uppercase tracking-widest hover:underline">
                View on Map <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>

          {/* Contact panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-slate-900 rounded-sm shadow-2xl shadow-slate-900/20 relative overflow-hidden flex flex-col md:flex-row border border-slate-800">
            <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="p-10 flex-1 relative z-10 flex flex-col justify-center">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">{contactPanel.heading}</h3>
              <p className="font-sans text-slate-400 mb-8 leading-relaxed text-sm md:text-base pr-8">{contactPanel.subheading}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="p-2 bg-white/5 rounded text-blue-400 group-hover:text-white transition-colors"><Phone size={18} /></div>
                  <span className="font-mono text-sm font-bold text-slate-300 group-hover:text-white transition-colors tracking-wide">{contactPanel.phone}</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-2 bg-white/5 rounded text-blue-400 group-hover:text-white transition-colors"><Mail size={18} /></div>
                  <span className="font-mono text-sm font-bold text-slate-300 group-hover:text-white transition-colors tracking-wide">{contactPanel.email}</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-600 p-10 md:w-64 flex flex-col items-center justify-center text-center relative z-10">
              <button onClick={() => setShowTnc(true)}
                className="group w-full bg-white text-blue-700 px-6 py-4 rounded-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest">Enquiry Form</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-2 text-blue-200">
                <Globe size={12} />
                <p className="text-[10px] leading-tight">Global Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showTnc && (
          <TermsModal isOpen={showTnc} config={termsModal}
            onClose={() => setShowTnc(false)}
            onAgree={() => { setShowTnc(false); setTimeout(() => setShowForm(true), 300); }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showForm && <ContactFormModal isOpen={showForm} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}