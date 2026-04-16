import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#202b5a',
          light: '#2d3a6e',
          dark: '#161f42',
        },
        deep: {
          green: '#0d322f',
          'green-light': '#0f3d39',
        },
        accent: {
          blue: '#126bb2',
          'blue-light': '#1a7ac2',
          teal: '#0c857d',
          'teal-light': '#0e9a90',
        },
        forest: {
          50: '#f0f7f0',
          100: '#dcebdc',
          200: '#bcd9bc',
          300: '#8fbf8f',
          400: '#5d9d5d',
          500: '#3d813d',
          600: '#2e652e',
          700: '#265026',
          800: '#224122',
          900: '#1d371d',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-eco': 'linear-gradient(135deg, #202b5a 0%, #0c857d 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(13,50,47,0.75) 0%, rgba(32,43,90,0.6) 100%)',
        'gradient-soft': 'linear-gradient(135deg, #126bb2 0%, #0c857d 100%)',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
