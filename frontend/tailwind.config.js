/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#07090d',
          900: '#0b0f16',
          800: '#121823',
          700: '#1b2432',
          600: '#2a3344',
        },
        accent: {
          DEFAULT: '#ff5a1f',
          glow: '#ff8a52',
        },
        chrome: '#c8cdd6',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(255,90,31,0.55)',
        card: '0 10px 40px -10px rgba(0,0,0,0.55)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
