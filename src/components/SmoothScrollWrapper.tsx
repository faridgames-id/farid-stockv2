import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

interface SmoothScrollProps {
  children: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * GSAP-Synchronized Lenis Smooth Scroll Wrapper
 *
 * Attaches Lenis to the parent scroll container.
 * Mobile: disabled → native OS scroll.
 */
export default function SmoothScrollWrapper({ children, onScroll }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Disable on mobile — native scroll is better for battery/heat
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const wrapper = containerRef.current;
    if (!wrapper) return;

    const content = wrapper.firstElementChild as HTMLElement;
    if (!content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 0,
    });

    lenisRef.current = lenis;

    const gsapTickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(gsapTickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(gsapTickerCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden"
    >
      {children}
    </div>
  );
}
