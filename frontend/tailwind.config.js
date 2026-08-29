/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#020817',
        glass: '#0f172a',
      },
      boxShadow: {
        glow: '0 0 30px rgba(34, 211, 238, 0.2)',
      },
    },
  },
  plugins: [],
}

