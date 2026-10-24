// Three orthographic views: side (hero), front, rear.
// Dimension callouts in the Chevy-C10 / Jaguar-XK120 reference style:
// hairline leaders + stroked arrows + mono value labels.
// Pure SVG — no raster image dependency.

const INK = 'currentColor';

function Dim({ x1, y1, x2, y2, label, place = 'below' }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = place === 'below' ? 0 : (place === 'right' ? 10 : -10);
  const dy = place === 'below' ? 10 : 0;
  return (
    <g stroke={INK} strokeWidth="0.5" fill="none" fontFamily="JetBrains Mono" fontSize="5">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {/* arrow caps */}
      <line x1={x1} y1={y1-2} x2={x1} y2={y1+2} />
      <line x1={x2} y1={y2-2} x2={x2} y2={y2+2} />
      <text x={mx + dx} y={my + dy} textAnchor="middle" fill={INK} stroke="none" style={{letterSpacing:0.5}}>
        {label}
      </text>
    </g>
  );
}

export function CarSideHero({ className = '' }) {
  // 360×140 viewbox — a semi-realistic hardtop silhouette with dimension lines
  return (
    <svg viewBox="0 0 360 170" className={className} aria-hidden="true">
      <g stroke={INK} strokeWidth="1.25" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {/* lower rocker */}
        <path d="M14 92 L52 92" />
        <path d="M86 92 L254 92" />
        <path d="M290 92 L344 92" />
        {/* body outline */}
        <path d="M14 92 L22 72 Q30 60 60 56 L132 44 Q190 38 230 44 L280 50 Q320 56 342 70 L344 92" />
        {/* beltline */}
        <path d="M60 56 L278 56" />
        {/* roof */}
        <path d="M78 56 Q116 24 180 22 Q230 22 254 32 L268 56" />
        {/* door seams */}
        <path d="M178 22 L178 56" />
        <path d="M156 56 L156 86" />
        <path d="M204 56 L204 86" />
        {/* handles */}
        <rect x="162" y="66" width="8" height="2.5" />
        <rect x="212" y="66" width="8" height="2.5" />
        {/* grille / headlight */}
        <path d="M332 68 L344 76 L344 86 L330 86 Z" />
        <circle cx="326" cy="72" r="3.2" />
        {/* mirror */}
        <path d="M80 56 L74 48 L84 48 Z" />
        {/* wheels */}
        <circle cx="68" cy="100" r="18" />
        <circle cx="68" cy="100" r="9" />
        <circle cx="68" cy="100" r="2.5" />
        <circle cx="272" cy="100" r="18" />
        <circle cx="272" cy="100" r="9" />
        <circle cx="272" cy="100" r="2.5" />
      </g>

      {/* ─── Dimension callouts ─── */}
      {/* Overall length (bottom) */}
      <Dim x1={14} y1={132} x2={344} y2={132} label="OVERALL LENGTH 196.8 in" />
      {/* Wheelbase */}
      <Dim x1={68} y1={148} x2={272} y2={148} label="WHEELBASE 119.0 in" />
      {/* Height (right side vertical) */}
      <g stroke={INK} strokeWidth="0.5" fill="none" fontFamily="JetBrains Mono" fontSize="5">
        <line x1={354} y1={22} x2={354} y2={116} />
        <line x1={352} y1={22} x2={356} y2={22} />
        <line x1={352} y1={116} x2={356} y2={116} />
        <text x={354} y={70} textAnchor="start" transform="rotate(-90 354 70)" fill={INK} stroke="none" style={{letterSpacing:0.5}}>
          HEIGHT 53.2 in
        </text>
      </g>
    </svg>
  );
}

export function CarFront({ className = '' }) {
  return (
    <svg viewBox="0 0 180 130" className={className} aria-hidden="true">
      <g stroke={INK} strokeWidth="1.1" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {/* ground */}
        <path d="M18 100 L162 100" />
        {/* body silhouette */}
        <path d="M28 100 L28 62 Q32 46 48 42 L132 42 Q148 46 152 62 L152 100" />
        {/* roofline */}
        <path d="M48 42 L54 22 L126 22 L132 42" />
        {/* windshield */}
        <path d="M54 24 L128 24" />
        {/* grille */}
        <rect x="56" y="68" width="68" height="18" />
        <path d="M58 68 L58 86 M66 68 L66 86 M74 68 L74 86 M82 68 L82 86 M90 68 L90 86 M98 68 L98 86 M106 68 L106 86 M114 68 L114 86 M122 68 L122 86" />
        {/* headlights */}
        <circle cx="42" cy="74" r="6" />
        <circle cx="138" cy="74" r="6" />
        {/* wheels */}
        <ellipse cx="34" cy="100" rx="10" ry="6" />
        <ellipse cx="146" cy="100" rx="10" ry="6" />
      </g>
      <Dim x1={18} y1={118} x2={162} y2={118} label="WIDTH 77.6 in" />
    </svg>
  );
}

export function CarRear({ className = '' }) {
  return (
    <svg viewBox="0 0 180 130" className={className} aria-hidden="true">
      <g stroke={INK} strokeWidth="1.1" fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M18 100 L162 100" />
        <path d="M28 100 L28 62 Q32 46 48 42 L132 42 Q148 46 152 62 L152 100" />
        <path d="M48 42 L54 22 L126 22 L132 42" />
        <path d="M54 24 L128 24" />
        {/* rear window */}
        <path d="M60 28 L120 28 L116 40 L64 40 Z" />
        {/* trunk crease */}
        <path d="M90 42 L90 70" />
        {/* taillights */}
        <rect x="34" y="72" width="18" height="10" />
        <rect x="128" y="72" width="18" height="10" />
        {/* plate */}
        <rect x="74" y="76" width="32" height="10" />
        {/* bumper */}
        <path d="M28 90 L152 90" />
        {/* wheels */}
        <ellipse cx="34" cy="100" rx="10" ry="6" />
        <ellipse cx="146" cy="100" rx="10" ry="6" />
      </g>
      <Dim x1={28} y1={118} x2={152} y2={118} label="TRACK 66.4 in" />
    </svg>
  );
}

/* ── Mechanical insets (small bottom-row diagrams) ────────────── */

export function EngineBlock({ className = '' }) {
  return (
    <svg viewBox="0 0 160 100" className={className} aria-hidden="true">
      <g stroke={INK} strokeWidth="1.1" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {/* block */}
        <rect x="24" y="34" width="112" height="48" />
        {/* 6 cylinders along the top */}
        {[0,1,2,3,4,5].map(i => (
          <g key={i}>
            <rect x={30 + i*17} y={18} width="12" height="16" />
            <circle cx={36 + i*17} cy="14" r="2.5" />
          </g>
        ))}
        {/* intake manifold */}
        <path d="M30 44 L130 44 L124 54 L36 54 Z" />
        {/* exhaust */}
        <path d="M24 60 L10 60 L10 82 L24 82" />
        {/* oil pan */}
        <path d="M28 82 L132 82 L124 94 L36 94 Z" />
        {/* belt pulley */}
        <circle cx="140" cy="58" r="7" />
        <circle cx="140" cy="58" r="2" />
      </g>
      <text x={80} y={10} textAnchor="middle" fill={INK} fontFamily="JetBrains Mono" fontSize="6" letterSpacing="1">
        3.6L V6 — SCHEMATIC
      </text>
    </svg>
  );
}

export function WheelDiagram({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g stroke={INK} strokeWidth="1.1" fill="none">
        <circle cx="50" cy="50" r="42" />
        <circle cx="50" cy="50" r="34" />
        <circle cx="50" cy="50" r="20" />
        <circle cx="50" cy="50" r="4" />
        {/* 5-spoke */}
        {[0,72,144,216,288].map(a => {
          const r = (a * Math.PI) / 180;
          const x1 = 50 + Math.cos(r) * 6;
          const y1 = 50 + Math.sin(r) * 6;
          const x2 = 50 + Math.cos(r) * 32;
          const y2 = 50 + Math.sin(r) * 32;
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2" />;
        })}
      </g>
      <text x={50} y={96} textAnchor="middle" fill={INK} fontFamily="JetBrains Mono" fontSize="6" letterSpacing="1">
        P245/45R17
      </text>
    </svg>
  );
}

export function ChassisDiagram({ className = '' }) {
  return (
    <svg viewBox="0 0 220 90" className={className} aria-hidden="true">
      <g stroke={INK} strokeWidth="1" fill="none" strokeLinejoin="round">
        {/* ladder frame */}
        <path d="M12 30 L208 30 M12 54 L208 54" />
        {/* cross-members */}
        <path d="M30 30 L30 54 M70 30 L70 54 M110 30 L110 54 M150 30 L150 54 M190 30 L190 54" />
        {/* wheels */}
        <circle cx="40" cy="68" r="8" /> <circle cx="40" cy="68" r="3" />
        <circle cx="180" cy="68" r="8" /><circle cx="180" cy="68" r="3" />
        <path d="M40 60 L40 54 M180 60 L180 54" />
        {/* diff / axle */}
        <rect x="168" y="46" width="24" height="4" />
        <rect x="30" y="46" width="24" height="4" />
        {/* driveshaft */}
        <path d="M54 50 L168 50" />
      </g>
      <text x={110} y={14} textAnchor="middle" fill={INK} fontFamily="JetBrains Mono" fontSize="6" letterSpacing="1.2">
        CHASSIS — LADDER FRAME · RWD
      </text>
    </svg>
  );
}
