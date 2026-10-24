// A tiny patent-drawing style side-elevation of a generic car.
// Pure SVG, no fill — just hairline outlines, as if from a workshop manual.
// Used as decoration on the window sticker. The 'tone' prop lets us tint it.
export function CarDiagram({ className = '', tone = 'currentColor' }) {
  const s = tone;
  return (
    <svg viewBox="0 0 320 100" className={className} aria-hidden="true">
      <g fill="none" stroke={s} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        {/* body silhouette */}
        <path d="M12 72 L34 72 Q40 42 72 36 L140 30 Q180 28 210 36 L256 46 Q290 52 304 62 L304 72 L288 72" />
        {/* belt line */}
        <path d="M60 36 L220 36" />
        {/* roof */}
        <path d="M72 36 Q110 10 170 10 Q210 10 232 20 L242 36" />
        {/* door split */}
        <path d="M152 10 L152 36" />
        <path d="M138 36 L138 58" />
        {/* front/rear wheels */}
        <circle cx="78" cy="78" r="16" />
        <circle cx="78" cy="78" r="7" />
        <circle cx="246" cy="78" r="16" />
        <circle cx="246" cy="78" r="7" />
        {/* side rails under body */}
        <path d="M12 72 L62 72" />
        <path d="M94 72 L230 72" />
        <path d="M262 72 L304 72" />
        {/* grille suggestion */}
        <path d="M292 58 L302 62" />
        {/* mirror */}
        <path d="M72 36 L68 30 L74 30 Z" />
        {/* callout a — overall length */}
        <g strokeWidth="0.6">
          <path d="M12 92 L304 92" />
          <path d="M12 88 L12 96 M304 88 L304 96" />
        </g>
      </g>
      <text x="158" y="99" textAnchor="middle" fill={s} style={{fontFamily:'JetBrains Mono', fontSize: 6, letterSpacing: 1}}>
        OVERALL LENGTH — REF. A
      </text>
    </svg>
  );
}
