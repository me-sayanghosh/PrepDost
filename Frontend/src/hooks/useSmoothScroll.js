import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useSmoothScroll
 * Initialises Lenis smooth scroll and synchronises it with GSAP's ticker
 * so that GSAP ScrollTrigger animations stay perfectly in sync.
 *
 * Options:
 *   duration   — scroll inertia duration in seconds (default 1.2)
 *   easing     — easing function (default smooth cubic)
 *   lerp       — linear interpolation factor 0–1 (lower = smoother, default 0.1)
 *   wheelMult  — wheel scroll speed multiplier (default 1.0)
 *   touchMult  — touch scroll speed multiplier (default 2.0)
 */
export function useSmoothScroll({
  duration = 1.2,
  easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  lerp = 0.1,
  wheelMultiplier = 1.0,
  touchMultiplier = 2.0,
} = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialise Lenis
    const lenis = new Lenis({
      duration,
      easing,
      lerp,
      wheelMultiplier,
      touchMultiplier,
      smoothWheel: true,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Hook Lenis into GSAP's ticker for frame-perfect sync
    const onTick = (time) => {
      lenis.raf(time * 1000); // GSAP time is in seconds, Lenis wants ms
    };
    gsap.ticker.add(onTick);

    // Tell GSAP's lagSmoothing to work alongside Lenis
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger positions fresh whenever Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // Cleanup on unmount / route change
    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [duration, lerp, wheelMultiplier, touchMultiplier]);

  return lenisRef;
}
