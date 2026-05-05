'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ChevronDown, LayoutGrid, FileText, ExternalLink, Paperclip, Hash, ArrowRight } from 'lucide-react';
import ImageCarousel from '@/components/ImageCarousel';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { KhaleelRenderer } from 'khaleel-editor';
import "khaleel-editor/dist/khaleel-editor.css";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ImageData = {
  id: string;
  url: string;
  caption?: string | null;
  altText: string;
};

export type DocumentData = {
  id: string;
  url: string;
  title: string | null;
  filename: string;
  fileSize?: number;
};

export type SectionData = {
  id: string;
  title: string;
  content: string;
  order: number;
  children: SectionData[];
  images: ImageData[];
  documents: DocumentData[];
};

type PageData = {
  title: string;
  sections: SectionData[];
};

function SmartContentRenderer({ content, className }: { content: string, className?: string }) {
  let parsedContent: any = null;
  let isJson = false;

  if (content && typeof content === 'string') {
    if (content.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(content);
        
        if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
          isJson = true;
          parsedContent = parsed;
        }
      } catch (e) {
        isJson = false;
      }
    }
  } else if (typeof content === 'object' && content !== null) {
     isJson = true;
     parsedContent = content;
  }

  if (isJson && parsedContent) {
    return (
      <div className={className}>
        <KhaleelRenderer content={parsedContent} />
      </div>
    );
  }

  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}

function SectionDocuments({ docs }: { docs: DocumentData[] }) {
  if (!docs || docs.length === 0) return null;

  return (
    <div className="mt-8 mb-6 pt-6 border-t border-gray-300">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center w-5 h-5 bg-gray-100 rounded-sm">
             <Paperclip size={12} className="text-gray-500" />
        </span>
        <h4 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Technical Documentation
        </h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <a 
            key={doc.id}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col p-4 bg-gray-50 border border-gray-300 rounded-sm hover:bg-white hover:border-blue-700 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
                 <div className="p-2 bg-white border border-gray-300 rounded-sm group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                     <FileText size={18} />
                 </div>
                 <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-700 transition-colors" />
            </div>
            
            <p className="font-sans font-medium text-gray-900 text-sm mb-1 line-clamp-2">
               {doc.title || doc.filename}
            </p>
            
            <div className="mt-auto pt-2 flex items-center gap-2">
                 <span className="font-mono text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm uppercase">
                    {doc.filename.split('.').pop() || 'FILE'}
                 </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function DeepNestedSection({ section }: { section: SectionData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 border border-gray-300 rounded-sm bg-white hover:border-blue-700 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left group"
      >
        <div className="flex items-center gap-3">
            <span className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                isOpen ? "bg-blue-700" : "bg-gray-300 group-hover:bg-blue-700"
            )} />
            <span className={cn(
                "font-bold text-gray-900 text-sm md:text-base transition-colors",
                isOpen ? "text-blue-800" : "group-hover:text-blue-700"
            )}>
                {section.title}
            </span>
        </div>
        <ChevronDown 
          size={16} 
          className={cn("text-gray-400 transition-transform duration-300", isOpen && "rotate-180 text-blue-700")} 
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-gray-300 bg-gray-50">
          
          {section.images?.length > 0 && (
            <div className="mb-6">
               <ImageCarousel images={section.images} />
            </div>
          )}
          
          <SmartContentRenderer 
            content={section.content} 
            className="prose prose-sm prose-slate max-w-none text-gray-600 font-sans"
          />

          <SectionDocuments docs={section.documents} />

          {section.children?.length > 0 && (
            <div className="mt-6 space-y-2 pl-4 border-l border-gray-300">
              {section.children.map(child => (
                <DeepNestedSection key={child.id} section={child} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FeatureBlock({ section, index }: { section: SectionData; index: number }) {
  const isEven = index % 2 === 0;
  const hasImages = section.images && section.images.length > 0;

  return (
    <div className="py-16 md:py-24 border-b border-dashed border-gray-300 last:border-0">
      <div className={cn(
        "flex flex-col gap-12 lg:gap-16",
        hasImages ? (isEven ? "lg:flex-row" : "lg:flex-row-reverse") : "lg:flex-col"
      )}>
        
        <div className={cn("flex-1 min-w-0", hasImages ? "lg:w-1/2" : "w-full")}>
          <div className="flex items-center gap-3 mb-6">
             <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-sm uppercase tracking-wider">
                Specification 0{section.order + 1}
             </span>
             <div className="h-px flex-1 bg-gray-300"></div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight" style={{ color: '#113388' }}>
            {section.title}
          </h3>
          
          <SmartContentRenderer 
            content={section.content} 
            className="prose prose-lg prose-slate text-gray-600 leading-relaxed max-w-none"
          />

          <SectionDocuments docs={section.documents} />

          {section.children && section.children.length > 0 && (
            <div className="mt-10">
              <h4 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Hash size={12} /> Detailed Breakdown
              </h4>
              <div className="space-y-3">
                  {section.children.map(child => (
                    <DeepNestedSection key={child.id} section={child} />
                  ))}
              </div>
            </div>
          )}
        </div>

        {hasImages && (
          <div className="lg:w-1/2 w-full">
             <div className="sticky top-32">
                 <div className="relative">
                    <ImageCarousel images={section.images} />
                 </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RootSection({ section, index }: { section: SectionData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section 
      id={section.id} 
      ref={ref}
      className="mb-32 scroll-mt-32"
    >
      <div className="sticky top-[70px] z-30 bg-white/95 backdrop-blur-md py-6 border-b border-gray-300 mb-10 transition-all">
        <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white font-mono text-sm font-bold rounded-sm shadow-md">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: '#113388' }}>
              {section.title}
            </h2>
        </div>
      </div>

      <div className="mb-16">
        {section.images && section.images.length > 0 && (
          <div className="mb-10 w-full">
             <ImageCarousel images={section.images} />
          </div>
        )}
        
        <SmartContentRenderer 
            content={section.content} 
            className="prose prose-xl prose-slate max-w-4xl text-gray-700 leading-8 font-sans"
        />

        <SectionDocuments docs={section.documents} />
      </div>

      <div className="pl-0 md:pl-8 border-l border-gray-300 md:ml-4 space-y-8">
        {section.children && section.children.map((child, idx) => (
          <FeatureBlock key={child.id} section={child} index={idx} />
        ))}
      </div>
    </section>
  );
}

export default function DynamicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  // 1. Fetch Data
  useEffect(() => {
    if (!slug) return;
    async function getPageData() {
      try {
        const res = await fetch(`/api/pages/${slug}`);
        if (!res.ok) { setPage(null); return; }
        const data = await res.json();
        setPage(data);
        setActiveSection(0);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    }
    getPageData();
  }, [slug]);

  const goToSection = (index: number) => {
    setActiveSection(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-700 rounded-full animate-spin mb-4"></div>
      <p className="font-mono text-xs text-gray-400 uppercase tracking-widest animate-pulse">Retrieving Data...</p>
    </div>
  );

  if (!page || !page.sections || page.sections.length === 0) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#113388' }}>404 - Page Not Found</h1>
        <p className="text-gray-500">The requested content does not exist.</p>
    </div>
  );

  const currentSection = page.sections[activeSection];
  const totalSections = page.sections.length;
  const hasNext = activeSection < totalSections - 1;
  const hasPrev = activeSection > 0;

  return (
    <div className="bg-white min-h-screen">
      
      <div className="bg-gray-900 text-white py-20 md:py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
         <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent"></div>
         
         <div className="container mx-auto px-6 relative z-10 max-w-7xl">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/10 bg-white/5 rounded-full backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span className="font-mono text-[10px] font-bold text-blue-200 uppercase tracking-widest">{page.title}</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                {currentSection.title}
                </h1>
                
                <div className="h-1 w-24 bg-blue-700 rounded-full"></div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16 max-w-7xl">
        
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-[100px]">
            <div className="bg-white rounded-sm border border-gray-300 shadow-xl shadow-gray-300/50 p-6">
              <h3 className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <LayoutGrid size={12} /> {page.title} Sections
              </h3>
              
              <nav className="space-y-2">
                {page.sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => goToSection(idx)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-sm font-medium text-sm transition-all",
                      activeSection === idx 
                        ? "bg-blue-700 text-white" 
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {idx + 1}. {section.title}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-300">
                 <p className="font-sans text-xs text-gray-400 leading-relaxed">
                    Section {activeSection + 1} of {totalSections}
                 </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <section className="mb-16">
            {currentSection.images && currentSection.images.length > 0 && (
              <div className="mb-10 w-full">
                 <ImageCarousel images={currentSection.images} />
              </div>
            )}
            
            <SmartContentRenderer 
                content={currentSection.content} 
                className="prose prose-xl prose-slate max-w-4xl text-gray-700 leading-8 font-sans"
            />

            <SectionDocuments docs={currentSection.documents} />
          </section>

          {currentSection.children && currentSection.children.length > 0 && (
            <div className="pl-0 md:pl-8 border-l border-gray-300 md:ml-4 space-y-8 mb-16">
              {currentSection.children.map((child) => (
                <FeatureBlock key={child.id} section={child} index={0} />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-gray-300">
            
            <button
              onClick={() => goToSection(activeSection - 1)}
              disabled={!hasPrev}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 transition-colors flex items-center gap-2"
            >
              ← Previous
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">
                Section <span className="font-bold text-gray-900">{activeSection + 1}</span> of <span className="font-bold text-gray-900">{totalSections}</span>
              </p>
              <div className="mt-2 flex gap-1 justify-center">
                {page.sections.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSection(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      idx === activeSection ? "bg-gray-900" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => goToSection(activeSection + 1)}
              disabled={!hasNext}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 transition-colors flex items-center gap-2"
            >
              Next →
            </button>

          </div>
        </main>

      </div>
    </div>
  );
}