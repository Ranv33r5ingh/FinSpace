/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: {
          950: '#040810',
          900: '#070B14',
          800: '#0C1220',
          700: '#0F1629',
          600: '#141E35',
          500: '#1A2744',
          400: '#233259',
        },
        accent: {
          DEFAULT: '#00E5CC',
          dim: '#00E5CC1A',
          muted: '#00E5CC33',
        },
        neon: {
          green: '#00E0A0',
          red: '#FF4D6D',
          purple: '#A78BFA',
          blue: '#38BDF8',
          amber: '#FBB144',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'slide-in-right': 'slideInRight 0.35s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'number-tick': 'numberTick 0.5s ease forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 25px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,204,0.1)',
        'glow': '0 0 20px rgba(0,229,204,0.3)',
        'glow-sm': '0 0 10px rgba(0,229,204,0.2)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
        'modal': '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
