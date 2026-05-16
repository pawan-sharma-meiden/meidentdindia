'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_IMAGES = [
  '/images/hero/hero1.jpg',
  '/images/hero/hero2.jpg',
  '/images/hero/hero3.jpg',
  '/images/hero/hero4.jpg',
  '/images/hero/hero5.jpg',
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex(p => (p + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full bg-gray-900 overflow-hidden">
      <div className="relative h-96 md:h-[500px]">
        <img src={HERO_IMAGES[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="w-full h-full object-cover" />
        <button onClick={() => setCurrentIndex(p => (p - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 transition-colors" aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => setCurrentIndex(p => (p + 1) % HERO_IMAGES.length)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 transition-colors" aria-label="Next slide">
          <ChevronRight size={24} />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1">
          {currentIndex + 1} / {HERO_IMAGES.length}
        </div>
      </div>
    </div>
  );
}