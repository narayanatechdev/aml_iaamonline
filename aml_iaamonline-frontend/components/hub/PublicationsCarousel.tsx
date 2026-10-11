'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Horizontal rail for the publication cards: three at a time, with arrows.
 *
 * The cards themselves stay server-rendered and arrive as children, so only
 * the scrolling needs the browser. The rail is a real overflow container with
 * scroll snapping, which means a trackpad, a touchscreen and the keyboard all
 * work on their own; the arrows are a convenience on top, not the mechanism.
 */
export function PublicationsCarousel({ children }: { children: React.ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const readPosition = useCallback(() => {
    const el = rail.current;
    if (!el) return;

    /* A sub-pixel gap is normal at either end, so allow a little slack. */
    const slack = 2;
    setAtStart(el.scrollLeft <= slack);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - slack);
  }, []);

  useEffect(() => {
    readPosition();
    const el = rail.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    /* The card width changes with the viewport, and so does whether the rail
       scrolls at all -- below three cards' worth it does not. */
    const observer = new ResizeObserver(readPosition);
    observer.observe(el);

    return () => observer.disconnect();
  }, [readPosition]);

  const step = (direction: 1 | -1) => {
    const el = rail.current;
    if (!el) return;

    const card = el.firstElementChild as HTMLElement | null;
    const distance = card ? card.getBoundingClientRect().width + 16 : el.clientWidth;
    el.scrollBy({ left: distance * direction, behavior: 'smooth' });
  };

  const arrow =
    'absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#DCE3F0] ' +
    'shadow-md flex items-center justify-center text-[#0B1F4D] transition-colors ' +
    'hover:bg-[#EAF1FD] disabled:opacity-0 disabled:pointer-events-none';

  return (
    <div className="relative mt-8">
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={atStart}
        aria-label="Previous publications"
        className={`${arrow} -left-3`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        ref={rail}
        onScroll={readPosition}
        tabIndex={0}
        role="group"
        aria-label="Publications"
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1
                   [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/30 rounded-[10px]"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => step(1)}
        disabled={atEnd}
        aria-label="More publications"
        className={`${arrow} -right-3`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
