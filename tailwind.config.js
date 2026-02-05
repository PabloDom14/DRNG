/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        drg: {
          orange: '#FC9E00',
          yellow: '#FFC600',
          dark: '#1a1a2e',
          darker: '#0f0f1a',
          card: '#252542',
        }
      },
      fontFamily: {
        drg: ['"Danger Flight"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
