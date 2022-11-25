/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'grid-pattern-light': "radial-gradient(circle, #1c1917 1px, rgba(0, 0, 0, 0) 1px)",
        'grid-pattern-dark': "radial-gradient(circle, #767676 1px, rgba(0, 0, 0, 0) 1px)"
      },
      backgroundSize: {
        'grid-40': "40px 40px"
      }
    },
  },
  plugins: [],
}
