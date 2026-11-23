/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff5ff',
          100: '#dbe8ff',
          500: '#2f74f0',
          600: '#1d63e8',
          700: '#164fc0',
        },
        navy: {
          700: '#16315f',
          800: '#0f2347',
          900: '#0a1830',
          950: '#071226',
        },
      },
    },
  },
  plugins: [],
};
