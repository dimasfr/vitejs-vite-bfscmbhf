/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f0ff', 100: '#e9e3ff', 200: '#d4c9ff', 300: '#b6a2ff',
          400: '#9576fb', 500: '#7c4ff5', 600: '#6d34e8', 700: '#5b27c9',
          800: '#4a22a3', 900: '#3b1f80',
        },
        ink: { 900: '#0b0f1a', 800: '#121826', 700: '#1a2236', 600: '#252f48' },
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      keyframes: {
        pop: {
          '0%': { opacity: 0, transform: 'translateY(8px) scale(.97)' },
          '100%': { opacity: 1, transform: 'none' },
        },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
      },
      animation: { pop: 'pop .22s ease-out', float: 'float 7s ease-in-out infinite' },
    },
  },
  plugins: [],
}
