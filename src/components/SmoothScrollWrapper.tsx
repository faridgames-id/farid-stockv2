import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * Optimized Lenis Smooth Scroll Wrapper
 * Snappy configuration to avoid lag/delay.
 * Mobile uses native momentum scroll.
 */
export default function SmoothScrollWrapper({ children, onScroll }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Lenis with settings for a fast, responsive smooth scroll without the "heavy" feeling
    const lenis = new Lenis({
      wrapper: containerRef.current,
      content: containerRef.current.firstElementChild as HTMLElement,
      lerp: 0.15, // Higher lerp makes it more snappy and less delayed
      wheelMultiplier: 1.2, // Slightly faster wheel movement
      smoothWheel: true,
      syncTouch: false, // Leave touch to native OS for zero delay on mobile
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden touch-pan-y overscroll-contain will-change-scroll scroll-smooth"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="w-full min-h-full">
        {children}
      </div>
    </div>
  );
}
