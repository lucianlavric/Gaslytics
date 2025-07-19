/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f0f9f4',
          100: '#dcf4e6',
          200: '#bce8d1',
          300: '#8dd5b3',
          400: '#56bd8f',
          500: '#31a373',
          600: '#22845d',
          700: '#1e6b4d',
          800: '#1c5440',
          900: '#194535',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};