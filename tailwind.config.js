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
        // Colores primarios basados en el logo
        'brand-teal': {
          50: '#e6f0ee',
          100: '#b0d2ca',
          200: '#8abfb1',
          300: '#5aa28f',
          400: '#3a8e7a',
          500: '#2D5C50', // Color principal del marco
          600: '#244a40',
          700: '#1b3730',
          800: '#122520',
          900: '#091210',
        },
        // Color secundario basado en la percha
        'brand-coral': {
          50: '#feefed',
          100: '#fccdca',
          200: '#fabaae',
          300: '#f6988d',
          400: '#f4857a',
          500: '#E27863', // Color de la percha
          600: '#c66051',
          700: '#984a3f',
          800: '#6b342d',
          900: '#3d1e19',
        },
        // Beige para fondos y neutrales
        'brand-beige': {
          50: '#fdfdfb',
          100: '#f9f8f0',
          200: '#F2EFDF', // Color del fondo
          300: '#e6e1c2',
          400: '#d8d1a6',
          500: '#c9c08a',
          600: '#b3a96f',
          700: '#938a57',
          800: '#6e6841',
          900: '#494529',
        },
        // Mantenemos alguna neutrales para textos y bordes
        'neutral': {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        // Fuentes con estilo manuscrito para títulos, para que coincidan con el logo
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
      backgroundImage: {
        'brushstroke-pattern': "url('/images/brushstroke-pattern.svg')",
      },
    },
  },
  plugins: [],
};