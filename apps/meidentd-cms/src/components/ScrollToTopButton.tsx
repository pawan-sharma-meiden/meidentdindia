'use client';

export default function ScrollToTopButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={className}
      aria-label="Scroll to top"
    >
      ⇧
    </button>
  );
}