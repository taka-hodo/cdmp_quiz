/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        correct: '#00C853',
        incorrect: '#D32F2F',
      },
    },
  },
  plugins: [],
}

