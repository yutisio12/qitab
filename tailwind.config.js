/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic: ['"Amiri Quran"', 'serif'],
      },
      colors: {
        glass: {
          light: 'rgba(255,255,255,0.05)',
          DEFAULT: 'rgba(255,255,255,0.08)',
          dark: 'rgba(0,0,0,0.04)',
        },
        surface: {
          dark: '#07070a',
          light: '#faf8f5',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.32,0.72,0,1) forwards',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.32,0.72,0,1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.32,0.72,0,1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px) blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0) blur(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.32,0.72,0,1)',
      },
    },
  },
  plugins: [],
}
