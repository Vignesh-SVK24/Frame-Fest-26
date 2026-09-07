/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fest: {
          black: '#080808',
          dark: '#111111',
          surface: '#181818',
          card: '#1f1f1f',
          border: '#2e2e2e',
          red: '#e50914',
          redHover: '#b80710',
          redGlow: 'rgba(229, 9, 20, 0.35)',
          muted: '#8e8e93',
          light: '#e5e5e7'
        }
      },
      fontFamily: {
        cinematic: ['Montserrat', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'film-gradient': 'radial-gradient(circle at 50% 30%, rgba(229, 9, 20, 0.12) 0%, rgba(10, 10, 10, 0.95) 75%)',
        'subtle-glow': 'radial-gradient(circle at top center, rgba(229, 9, 20, 0.18) 0%, transparent 60%)'
      }
    },
  },
  plugins: [],
}
