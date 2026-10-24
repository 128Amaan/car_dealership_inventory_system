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
        paper:   '#E6DCC2',   // aged vintage cream
        paper2:  '#D6C9A7',   // darker shadow / panel tone
        paperD:  '#C7B98F',   // vignette shadow stops
        ink:     '#1A1812',   // warm near-black
        inkblue: '#1F3A5F',   // workshop blueprint blue (Chevy C10 accent)
        signal:  '#B22222',   // muted brick red for warnings / price
        epa:     '#D9BF2A',   // aged yellow
        steel:   '#7A7466',
        rule:    '#9A8F72',
        mute:    '#5A5240',
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
