/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'test': ['Lora', 'serif'],
        'playfair-display': ['Playfair Display', 'serif']
        
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}