/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light theme surfaces
        base: '#EEF2F9',
        surface: '#FFFFFF',
        'surface-2': '#F3F6FC',
        ink: '#0F172A',
        violet: {
          DEFAULT: '#7C3AED',
          glow: 'rgba(124,58,237,0.15)',
        },
        pink: { DEFAULT: '#EC4899' },
        cyan: { DEFAULT: '#0891B2' },
        blue: { DEFAULT: '#3B82F6' },
        ok: '#059669',
        warn: '#D97706',
        fail: '#DC2626',
        healed: '#7C3AED',
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      backgroundImage: {
        'grad-violet': 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
        'grad-cyan': 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
        'grad-mixed': 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #06B6D4 100%)',
      },
      boxShadow: {
        'glow-violet': '0 10px 30px rgba(124,58,237,0.16)',
        'glow-cyan': '0 10px 30px rgba(8,145,178,0.16)',
        'glow-soft': '0 10px 30px rgba(15,23,42,0.08)',
      },
      backdropBlur: {
        card: '24px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.85)' },
        },
        aurora: {
          '0%': { transform: 'translate(0,0) rotate(0deg)' },
          '33%': { transform: 'translate(6%,-4%) rotate(40deg)' },
          '66%': { transform: 'translate(-4%,6%) rotate(-30deg)' },
          '100%': { transform: 'translate(0,0) rotate(0deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        breathe: 'breathe 1.8s ease-in-out infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
