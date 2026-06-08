import React from 'react';

/**
 * PrepDostLogo — uses the official logo.png
 * Props:
 *   variant : 'dark' (default, on light bg) | 'light' (on dark bg, applies white filter)
 *   height  : number in px (default 36)
 *   style   : extra inline styles (optional)
 */
const PrepDostLogo = ({ variant = 'dark', height = 36, style = {} }) => {
  return (
    <img
      src="/logo.png"
      alt="PrepDost"
      height={height}
      style={{
        display: 'block',
        objectFit: 'contain',
        // On dark backgrounds invert+tweak so the navy logo reads white
        filter: variant === 'light'
          ? 'brightness(0) invert(1)'
          : 'none',
        ...style,
      }}
      draggable={false}
    />
  );
};

export default PrepDostLogo;
