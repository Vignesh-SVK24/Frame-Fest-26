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
          black: '#07060b',
          dark: '#0e0b16',
          surface: '#151124',
          card: '#1b1530',
          border: '#2e2550',
          red: '#8b5cf6', // mapped to vibrant violet for backwards compatibility
          redHover: '#7c3aed',
          redGlow: 'rgba(139, 92, 246, 0.4)',
          purple: '#8b5cf6',
          purpleHover: '#7c3aed',
          purpleDark: '#6d28d9',
          lavender: '#c084fc',
          lavenderLight: '#e9d5ff',
          violetGlow: 'rgba(139, 92, 246, 0.4)',
          muted: '#9e95b9',
          light: '#f5f3ff'
        }
      },
      fontFamily: {
        cinematic: ['Montserrat', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'film-gradient': 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.16) 0%, rgba(10, 8, 18, 0.96) 75%)',
        'subtle-glow': 'radial-gradient(circle at top center, rgba(139, 92, 246, 0.25) 0%, transparent 60%)'
      }
    },
  },
  plugins: [],
}
