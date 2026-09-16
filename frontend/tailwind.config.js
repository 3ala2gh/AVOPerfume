/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0b0b0c',
          soft: '#1a1a1d',
          muted: '#6b6259',
        },
        ivory: '#fbf9f5',
        sand: '#f2ece3',
        champagne: {
          DEFAULT: '#b8925a',
          light: '#c9a26d',
          dark: '#96723f',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.22em',
        wider2: '0.32em',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 11, 12, 0.04), 0 12px 32px -18px rgba(11, 11, 12, 0.35)',
        lift: '0 24px 60px -28px rgba(11, 11, 12, 0.45)',
        glow: '0 0 0 1px rgba(184, 146, 90, 0.35), 0 18px 40px -22px rgba(184, 146, 90, 0.6)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ken-burns': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(1.12)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scroll-hint': {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.35' },
          '50%': { transform: 'translateY(7px)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'ken-burns': 'ken-burns 18s ease-out both',
        shimmer: 'shimmer 2.4s linear infinite',
        'scroll-hint': 'scroll-hint 1.9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
