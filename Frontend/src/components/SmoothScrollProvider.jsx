import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

/**
 * SmoothScrollProvider
 * Drop this inside your router (needs access to useLocation).
 * It enables Lenis + GSAP smooth scroll on every page and
 * automatically scrolls to the top on route changes.
 */
export function SmoothScrollProvider({ children }) {
  const lenisRef = useSmoothScroll({
    duration: 1.4,       // inertia feel — higher = slower/smoother
    lerp: 0.08,          // interpolation — 0.06–0.12 is the sweet spot
    wheelMultiplier: 0.9, // slightly slower wheel for premium feel
    touchMultiplier: 1.8,
  });

  const { pathname } = useLocation();

  // Scroll to top instantly on route change (no smooth animation)
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenisRef]);

  return children;
}
