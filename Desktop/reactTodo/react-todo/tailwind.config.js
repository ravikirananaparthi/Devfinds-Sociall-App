/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700', // You can use any hex, rgb, rgba, hsl, etc. value
      },
    },
  },
  plugins: [],
}

