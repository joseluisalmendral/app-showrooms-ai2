/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nueva paleta de colores moderna
        'brand-mauve': {
          50: '#f4efff',
          100: '#e9dfff',
          200: '#d7c1ff',
          300: '#c5a3ff', // Color principal (mauve)
          400: '#b285ff',
          500: '#9f68fc',
          600: '#8a4cef',
          700: '#7538d7',
          800: '#6029c1',
          900: '#4f1e9e',
        },
        'brand-celeste': {
          50: '#f0fbfb',
          100: '#dcf7f7',
          200: '#bef0f1',
          300: '#a9e5e6', // Color secundario (celeste)
          400: '#86cfd1',
          500: '#5db4b6',
          600: '#458e90',
          700: '#367273',
          800: '#2c5c5d',
          900: '#254d4e',
        },
        // Colores neutrales
        'brand-neutral': {
          50: '#f7f7f7', // seasalt
          100: '#f1f1f1',
          200: '#e0e0e0', // platinum
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#9a9a9a',
          600: '#818181',
          700: '#6a6a6a',
          800: '#484848',
          900: '#272727',
          950: '#0d0d0d', // night
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        // Mantener fuentes con estilo manuscrito para títulos, para complementar el diseño
        handwritten: ['Caveat', 'Indie Flower', 'cursive'],
        heading: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        body: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },
    },
  },
  plugins: [],
};