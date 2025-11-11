/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          600: '#1e3a5f',
          700: '#1a3154',
          800: '#152642',
          900: '#0f1c2e',
        }
      }
    },
  },
  plugins: [],
}

