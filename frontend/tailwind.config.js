/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        din:    ['"Barlow Condensed"', 'ui-sans-serif', 'system-ui'],
        body:   ['"Barlow"', 'ui-sans-serif', 'system-ui'],
        mono:   ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        script: ['"Caveat"', 'ui-serif', 'cursive'],
      },
      colors: {
        paper:   '#D4B983',   // aged amber manuscript base
        paper2:  '#C19F62',   // shadow panel tone
        paperD:  '#8E7142',   // deep vignette stop (burnt edges)
        ink:     '#2A1E10',   // deep sepia-brown (was near-black)
        inkblue: '#2B4463',   // workshop blueprint blue (muted for amber ground)
        signal:  '#9A2A1E',   // oxidized brick red
        epa:     '#C4A030',   // amber-shifted yellow
        steel:   '#6E5A3D',
        rule:    '#8F7349',   // warm brown rule
        mute:    '#5F4A2A',   // deep warm brown
        stain:   '#5A3B1A',   // for foxing marks
      },
      letterSpacing: {
        punch: '0.14em',
        wide2: '0.08em',
      },
      keyframes: {
        rule:  { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        stamp: { '0%': { transform: 'rotate(-6deg) scale(1.1)', opacity: '0' },
                 '100%': { transform: 'rotate(-6deg) scale(1)', opacity: '1' } },
      },
      animation: {
        rule:  'rule 500ms cubic-bezier(.2,.8,.2,1) both',
        stamp: 'stamp 220ms cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
};
