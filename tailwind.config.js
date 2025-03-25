/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        bnb: {
          yellow: '#F0B90B',
          dark: '#1E2026',
          gray: '#474D57',
          light: '#EAECEF',
        },
      },
    },
  },
  plugins: [],
}
