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
    duration: 1.2,       // slightly shorter = snappier, less work per scroll
    lerp: 0.1,           // 0.1 is the sweet spot: smooth but not laggy
    wheelMultiplier: 1.0, // native-speed wheel, Lenis smooths the easing
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
