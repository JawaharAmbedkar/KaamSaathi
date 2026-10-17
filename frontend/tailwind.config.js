/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Manrope', 'sans-serif'] },
      colors: { ink: '#0b100e', panel: '#121916', line: '#25312b', mint: '#82e2ae' },
    },
  },
  plugins: [],
}
