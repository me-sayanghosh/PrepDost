import React from 'react';

/**
 * PrepDostLogo — SVG-based brand wordmark
 * Props:
 *   variant: 'dark' (navy on light, default) | 'light' (white on dark, for footer)
 *   height: number (default 36)
 */
const PrepDostLogo = ({ variant = 'dark', height = 36 }) => {
  const wordColor  = variant === 'light' ? '#ffffff' : '#0d1f3c';
  const lineColor  = variant === 'light' ? 'rgba(255,255,255,0.55)' : '#0d1f3c';
  const dotColor   = '#f5a623'; // gold

  // The SVG viewBox is 320 × 72 — aspect ratio ≈ 4.44 : 1
  const width = Math.round(height * (320 / 72));

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PrepDost"
      role="img"
    >
      {/* ── Wordmark ── */}
      <text
        x="0"
        y="48"
        fontFamily="'DM Sans', 'Montserrat', 'Nunito', sans-serif"
        fontWeight="800"
        fontSize="52"
        letterSpacing="-2"
        fill={wordColor}
      >
        PrepDost
      </text>

      {/* ── Left gold dot ── */}
      <circle cx="6"   cy="64" r="5" fill={dotColor} />
      {/* ── Right gold dot ── */}
      <circle cx="314" cy="64" r="5" fill={dotColor} />

      {/* ── Dual underline bars ── */}
      {/* Top bar */}
      <line x1="16" y1="60" x2="304" y2="60" stroke={lineColor} strokeWidth="2.2" strokeLinecap="round" />
      {/* Bottom bar */}
      <line x1="16" y1="67" x2="304" y2="67" stroke={lineColor} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
};

export default PrepDostLogo;
