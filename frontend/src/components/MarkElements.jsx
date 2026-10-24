// Reusable mark/badge/stamp elements: Barcode, QR square, feature icons.

export function Barcode({ code = 'BLD-0000-NY', width = 180, height = 36 }) {
  // Deterministic widths — use char codes to vary bar widths pseudo-randomly
  const bars = [];
  let x = 0;
  for (let i = 0; i < code.length * 3 + 8; i++) {
    const w = ((code.charCodeAt(i % code.length) + i * 7) % 4) + 1;
    const h = height;
    if (i % 2 === 0) bars.push({ x, w, h });
    x += w + 1;
  }
  const total = x;
  return (
    <div className="inline-block">
      <svg viewBox={`0 0 ${total} ${height}`} width={width} height={height} aria-hidden="true" preserveAspectRatio="none">
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={b.h} fill="currentColor" />
        ))}
      </svg>
      <div className="font-mono text-[10px] tracking-widest text-ink leading-tight text-center -mt-1">
        {code}
      </div>
    </div>
  );
}

export function QrPlate({ className = '', label = 'SCAN FOR BUILD SHEET' }) {
  // Decorative QR-like grid (not a real QR)
  const cells = [];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      // deterministic pattern
      const on = ((x * 31 + y * 17 + 11) % 5) < 2;
      // corner finders
      const corner =
        (x < 3 && y < 3) || (x > 6 && y < 3) || (x < 3 && y > 6);
      const edge =
        (x === 0 || x === 2 || y === 0 || y === 2) && corner;
      if (corner ? edge || (x === 1 && y === 1) : on) {
        cells.push(<rect key={`${x}-${y}`} x={x*5} y={y*5} width={5} height={5} fill="currentColor" />);
      }
    }
  }
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <svg viewBox="0 0 50 50" width="60" height="60" aria-hidden="true">
        <rect x="0" y="0" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1"/>
        {cells}
      </svg>
      <div className="punch text-mute text-center leading-tight max-w-[70px]">{label}</div>
    </div>
  );
}

/* ── Small line-icon tiles for feature strip ─────────────────── */

export function IconDriveFR({ className = '' }) {
  return (
    <svg viewBox="0 0 48 32" className={className}>
      <g stroke="currentColor" strokeWidth="1.2" fill="none">
        <rect x="4" y="10" width="40" height="12" />
        <circle cx="12" cy="22" r="5"/><circle cx="36" cy="22" r="5"/>
        <path d="M12 10 L12 22 M36 10 L36 22" />
        <path d="M12 16 L36 16" />
      </g>
    </svg>
  );
}

export function IconTransmission({ className = '' }) {
  return (
    <svg viewBox="0 0 48 32" className={className}>
      <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M8 8 L8 22 M16 8 L16 22 M24 8 L24 22 M32 8 L32 22 M40 8 L40 22" />
        <path d="M8 8 L40 8" />
        <path d="M8 22 L40 22" />
        <circle cx="24" cy="15" r="2" />
      </g>
    </svg>
  );
}

export function IconBrake({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <g stroke="currentColor" strokeWidth="1.2" fill="none">
        <circle cx="16" cy="16" r="12" />
        <circle cx="16" cy="16" r="5" />
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        <path d="M12 6 L8 2 M20 6 L24 2 M12 26 L8 30 M20 26 L24 30" />
      </g>
    </svg>
  );
}

export function IconWheel({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <g stroke="currentColor" strokeWidth="1.2" fill="none">
        <circle cx="16" cy="16" r="13" />
        <circle cx="16" cy="16" r="4" />
        {[0,72,144,216,288].map(a => {
          const r = (a*Math.PI)/180;
          return <line key={a} x1={16+Math.cos(r)*4} y1={16+Math.sin(r)*4} x2={16+Math.cos(r)*12} y2={16+Math.sin(r)*12} />;
        })}
      </g>
    </svg>
  );
}

export function IconStar({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <polygon points="12,2 15,9 22,10 17,15 18,22 12,18 6,22 7,15 2,10 9,9" fill="currentColor" />
    </svg>
  );
}

export function IconFlag({ className = '' }) {
  // Deliberately not a national flag — a generic "built in-house" pennant
  return (
    <svg viewBox="0 0 32 24" className={className}>
      <g stroke="currentColor" strokeWidth="1.2" fill="none">
        <path d="M4 2 L4 22" />
        <path d="M4 3 L26 3 L22 8 L26 13 L4 13 Z" fill="currentColor" />
      </g>
    </svg>
  );
}

export function IconManual({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <circle cx="16" cy="26" r="2.5" fill="currentColor"/>
        <path d="M16 23 L16 8" />
        <path d="M8 10 L24 10" />
        <path d="M8 10 L8 6 M24 10 L24 6" />
        <path d="M12 10 L12 6 M20 10 L20 6" />
        <text x="16" y="4" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="5" fill="currentColor" stroke="none">R</text>
      </g>
    </svg>
  );
}

/* ── Decorative header ornament ─────────────────────────────── */
export function StarBar({ className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 text-ink ${className}`}>
      <span className="h-px flex-1 bg-ink" />
      <IconStar className="w-2.5 h-2.5" />
      <IconStar className="w-2.5 h-2.5" />
      <IconStar className="w-2.5 h-2.5" />
      <span className="h-px flex-1 bg-ink" />
    </div>
  );
}
