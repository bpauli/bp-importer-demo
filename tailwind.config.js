/** @type {import('tailwindcss').Config} */
export default {
  content: ['./blocks/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Avenir, "Avenir Fallback", Arial, sans-serif'],
      },
      screens: {
        '2xl': '1440px',
      },
      colors: {
        'seconday': 'var(--color-secondary)',
        'comwrap-pink': '#ea0643',
        'comwrap-gray': '#4d555d',
        'comwrap-gray-light': '#7a7f86',
        'comwrap-black': '#161616',
        'comwrap-icon': '#212a35',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};
