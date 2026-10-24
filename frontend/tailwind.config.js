/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper:   '#F2EDE1',
        ink:     '#0E0E0C',
        rust:    '#B33F1A',
        moss:    '#3F4A3A',
        signal:  '#E6C01A',
        hair:    '#C8BFAD',  // hairline rule
        mute:    '#6B6659',  // secondary ink
      },
      fontSize: {
        'manifest': ['clamp(2.5rem, 7vw, 6.5rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'ticker':   ['clamp(1.5rem, 4vw, 3rem)',   { lineHeight: '0.95', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        'punch':   '0.14em',
      },
      keyframes: {
        rule:   { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        stamp:  { '0%': { transform: 'rotate(-18deg) scale(1.6)', opacity: '0' },
                  '60%': { transform: 'rotate(-10deg) scale(0.95)', opacity: '1' },
                  '100%': { transform: 'rotate(-6deg) scale(1)', opacity: '1' } },
        tick:   { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(0)' } },
      },
      animation: {
        rule:  'rule 600ms cubic-bezier(.2,.8,.2,1) both',
        stamp: 'stamp 400ms cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
};
