/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D7A3E',
          50: '#E8F5EA',
          100: '#D1ECD5',
          200: '#A3D9AB',
          300: '#75C581',
          400: '#47B257',
          500: '#2D7A3E',
          600: '#246231',
          700: '#1B4924',
          800: '#123118',
          900: '#09180B'
        },
        secondary: {
          DEFAULT: '#8B6F47',
          50: '#F5F1ED',
          100: '#EBE3DB',
          200: '#D7C7B7',
          300: '#C3AB93',
          400: '#AF8F6F',
          500: '#8B6F47',
          600: '#6F5939',
          700: '#53432B',
          800: '#372C1C',
          900: '#1B160E'
        },
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FEF7E6',
          100: '#FDEACC',
          200: '#FBD599',
          300: '#F9C066',
          400: '#F7AB33',
          500: '#F59E0B',
          600: '#C47F09',
          700: '#935F07',
          800: '#624004',
          900: '#312002'
        },
        surface: '#FFFFFF',
        background: '#F5F3EF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#DC2626',
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
  },
  plugins: [],
}