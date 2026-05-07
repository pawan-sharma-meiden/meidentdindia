'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Colors matching actual meidentd.in website
const COLORS = {
  white: '#ffffff',
  lightGray: '#f5f5f5',
  mediumGray: '#e0e0e0',
  darkGray: '#333333',
  textGray: '#666666',
  darkBlue: '#003366',
  lightBlue: '#0066cc',
};

const HERO_IMAGES = [
  '/images/hero/hero1.jpg',
  '/images/hero/hero2.jpg',
  '/images/hero/hero3.jpg',
  '/images/hero/hero4.jpg',
  '/images/hero/hero5.jpg',
];

// const NEWS = [
//   {
//     date: '2024-10-03',
//     title: 'Meiden T&D receives a large-scale order for a part of Traction substation equipment to be used in India\'s Mumbai-Ahmedabad High Speed Rail Project.',
//     category: 'Information'
//   },
//   {
//     date: '2024-06-11',
//     title: 'Meiden T&D receives certificate of appreciation for running its plant on Green Fuel.',
//     category: 'Information'
//   },
//   {
//     date: '2024-07-20',
//     title: 'Meiden T&D celebrates its Annual Day.',
//     category: 'Information'
//   },
//   {
//     date: '2024-04-24',
//     title: 'Notice of system maintenance.',
//     category: 'Information'
//   },
// ];

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  return (
      <div className="relative w-full bg-gray-900 overflow-hidden">
        <div className="relative h-96 md:h-[500px]">
          <img
              src={HERO_IMAGES[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover"
          />

          {/* Navigation Buttons */}
          <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 transition-colors"
              aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 transition-colors"
              aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1">
            {currentIndex + 1} / {HERO_IMAGES.length}
          </div>
        </div>
      </div>
  );
}

// const COLORS = {
//   darkBlue: "#003087",
// };
 
type NewsDetailContent =
  | { type: "text"; body: string; note?: string }
  | { type: "image"; src: string; alt: string }
  | { type: "pdf"; href: string; label: string }
  | { type: "maintenance"; schedule: string; notes: string[] };
 
interface NewsItem {
  date: string;
  category: string;
  title: string;
  year: string;
  detail: NewsDetailContent;
}
 
const NEWS: NewsItem[] = [
  {
    date: "2024-10-03",
    category: "Information",
    title:
      "Meiden T&D receives a large-scale order for a part of Traction substation equipment to be used in India's Mumbai-Ahmedabad High Speed Rail Project.",
    year: "2024",
    detail: {
      type: "pdf",
      href: "https://meidentd.in/images/news/dfd28e02bcfeceec4088f5766cf07724.pdf",
      label: "View Document",
    },
  },
  {
    date: "2024-06-11",
    category: "Information",
    title:
      "Meiden T&D receives certificate of appreciation for running its plant on Green Fuel.",
    year: "2024",
    detail: {
      type: "image",
      src: "https://meidentd.in/images/news/8d69d72a95e182189233e6fb9c82e30d.jpeg",
      alt: "Certificate of appreciation for Green Fuel",
    },
  },
  {
    date: "2024-07-20",
    category: "Information",
    title: "Meiden T&D celebrates its Annual Day.",
    year: "2024",
    detail: {
      type: "pdf",
      href: "https://meidentd.in/images/news/6ec7640b69f23e00a1255017357241fe.pdf",
      label: "View Document",
    },
  },
  {
    date: "2024-04-24",
    category: "Information",
    title: "Notice of system maintenance.",
    year: "2024",
    detail: {
      type: "maintenance",
      schedule: "Sunday, February 25, 2024  06:30 – 12:30",
      notes: [
        "During the above period, there will be intermittent inability to access the website.",
        "The time may vary depending on the work progress.",
      ],
    },
  },
  {
    date: "2024-04-24",
    category: "Information",
    title: "Notice of system maintenance.",
    year: "2024",
    detail: {
      type: "maintenance",
      schedule: "Sunday, February 25, 2024  06:30 – 12:30",
      notes: [
        "During the above period, there will be intermittent inability to access the website.",
        "The time may vary depending on the work progress.",
      ],
    },
  },
];

function NewsDetailPage({
  item,
  onBack,
}: {
  item: NewsItem;
  onBack: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-8 flex flex-wrap gap-1 items-center">
        <button
          onClick={onBack}
          className="hover:underline"
          style={{ color: COLORS.darkBlue }}
        >
          Home
        </button>
        <span>/</span>
        <button
          onClick={onBack}
          className="hover:underline"
          style={{ color: COLORS.darkBlue }}
        >
          News-Releases
        </button>
        <span>/</span>
        <span>{item.year}</span>
        <span>/</span>
        <span className="text-gray-700 truncate max-w-xs">{item.title}</span>
      </nav>
 
      {/* Year label */}
      <p
        className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: COLORS.darkBlue }}
      >
        News Releases {item.year}
      </p>
 
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 leading-snug">
        {item.title}
      </h2>
 
      {/* Date */}
      <p className="text-sm text-gray-500 mb-8">{item.date}</p>
 
      <hr className="border-gray-200 mb-8" />
 
      {/* Body quote */}
      <blockquote className="border-l-4 pl-4 text-gray-700 italic mb-8" style={{ borderColor: COLORS.darkBlue }}>
        "{item.title}"
      </blockquote>
 
      {/* Detail content */}
      <DetailContent detail={item.detail} />
 
      {/* Back link */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="text-sm font-medium flex items-center gap-2 hover:underline"
          style={{ color: COLORS.darkBlue }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          News-Releases
        </button>
      </div>
    </div>
  );
}
 
function DetailContent({ detail }: { detail: NewsDetailContent }) {
  if (detail.type === "pdf") {
    return (
      <a
        href={detail.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: COLORS.darkBlue }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        {detail.label}
      </a>
    );
  }
 
  if (detail.type === "image") {
    return (
      <img
        src={detail.src}
        alt={detail.alt}
        className="max-w-full border border-gray-200 shadow-sm"
      />
    );
  }
 
  if (detail.type === "maintenance") {
    return (
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          In order to perform system maintenance, accessing to our Web site will
          be suspended within the following period.
        </p>
        <div className="bg-gray-50 border border-gray-200 p-4">
          <p className="font-semibold mb-1">System maintenance schedule:</p>
          <p>{detail.schedule}</p>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          {detail.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
        <p className="text-gray-500 italic">
          We apologize for any inconvenience caused by this.
        </p>
      </div>
    );
  }
 
  return null;
}
 
// ── List page (your original NewsSection) ────────────────────────────────────
function NewsListPage({ onSelect }: { onSelect: (idx: number) => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="mb-8">
        <div className="flex gap-4 border-b border-gray-300 mb-6">
          <button
            className="pb-4 font-bold border-b-2"
            style={{ color: COLORS.darkBlue, borderColor: COLORS.darkBlue }}
          >
            News Releases
          </button>
        </div>
      </div>
 
      <div className="space-y-4">
        {NEWS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className="w-full text-left block p-4 border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="flex gap-4">
              <div className="text-sm text-gray-500 min-w-max">{item.date}</div>
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  {item.category}
                </div>
                <div className="text-gray-900 text-sm leading-relaxed hover:underline">
                  {item.title}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function NewsSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
 
  if (activeIdx !== null) {
    return (
      <NewsDetailPage
        item={NEWS[activeIdx]}
        onBack={() => setActiveIdx(null)}
      />
    );
  }
 
  return <NewsListPage onSelect={(idx) => setActiveIdx(idx)} />;
}

function CategoriesSection() {
  return (
      <div style={{ backgroundColor: COLORS.lightGray }} className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Category 1 */}
            <Link
                href="https://www.google.com/maps/place/Building+10,+Tower+C/@28.493262,77.085909,17z/data=!3m1!4b1!4m5!3m4!1s0x390d19eea6362009:0x3f09a13b45a094c5!8m2!3d28.493262!4d77.0880977?hl=en"
                className="group block overflow-hidden hover:opacity-80 transition-opacity"
            >
              <div className="mb-4">
                <img
                    src="/images/home-category-1.jpg"
                    alt="Access"
                    className="w-full h-64 object-cover"
                />
              </div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold" style={{ color: COLORS.darkBlue }}>
                  Access
                </h3>
                <img src="/images/meidensha-icon.png" alt="" className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-600 mt-2">Location and contact information</p>
            </Link>

            {/* Category 2 */}
            <a
                href="https://www.meidensha.com/onemeiden/"
                className="group block overflow-hidden hover:opacity-80 transition-opacity"
            >
              <div className="mb-4">
                <img
                    src="/images/home-category-2.gif"
                    alt="One Meiden"
                    className="w-full h-64 object-cover"
                />
              </div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold" style={{ color: COLORS.darkBlue }}>
                  One MEIDEN
                </h3>
                <img src="/images/meidensha-icon.png" alt="" className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-600 mt-2">Global Meidensha network</p>
            </a>
          </div>
        </div>
      </div>
  );
}

function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-white border border-gray-400 text-gray-700 px-4 py-2 text-sm font-bold hover:bg-gray-100 transition-colors"
      >
        ⇧ Top
      </button>
  );
}

export default function HomePage() {
  return (
      <main style={{ backgroundColor: COLORS.white }}>
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* News Section */}
        <NewsSection />

        {/* Categories Section */}
        <CategoriesSection />

        {/* Scroll to Top Button */}
        <ScrollToTop />

        {/* Footer Note */}
        <div style={{ backgroundColor: COLORS.lightGray }} className="text-center py-8 text-xs text-gray-600">
          <p>Meiden T&D India Limited</p>
          <p className="mt-2">Copyright © MEIDEN T&D (INDIA) LIMITED All rights reserved.</p>
        </div>
      </main>
  );
}