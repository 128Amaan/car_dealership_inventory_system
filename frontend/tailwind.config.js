/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        din:    ['"Barlow Condensed"', 'ui-sans-serif', 'system-ui'],
        body:   ['"Barlow"', 'ui-sans-serif', 'system-ui'],
        mono:   ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper:   '#EFECE3',
        paper2:  '#E6E2D6',   // slightly darker, for stamped boxes
        ink:     '#0C0C0A',
        signal:  '#D21919',   // signal-red, used sparingly
        epa:     '#F3D421',   // epa-yellow — fuel-economy panel ONLY
        steel:   '#8A8E8F',
        rule:    '#B9B3A3',
        mute:    '#5E5A4F',
      },
      letterSpacing: {
        punch: '0.14em',
        wide2: '0.08em',
      },
      keyframes: {
        rule:   { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        stamp:  { '0%': { transform: 'rotate(-6deg) scale(1.1)', opacity: '0' },
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
