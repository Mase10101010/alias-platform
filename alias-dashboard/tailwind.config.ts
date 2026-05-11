import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#050607', panel: '#0B0E10', cyanAlias: '#7FE3E6' },
      fontFamily: { display: ['Fraunces', 'serif'], sans: ['Inter Tight', 'system-ui', 'sans-serif'] },
      boxShadow: { glow: '0 0 50px rgba(127,227,230,.18)' }
    }
  },
  plugins: []
} satisfies Config;
