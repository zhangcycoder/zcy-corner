import React from 'react';

const scanLineStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.08) 2px, rgba(0, 0, 0, 0.08) 4px)',
  pointerEvents: 'none',
  zIndex: 9999,
};

export default function ScanLine() {
  return <div style={scanLineStyle} aria-hidden="true" />;
}
