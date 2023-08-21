/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ibm: ['IBM Plex Serif'],
      },
      colors: {
        'queue-400': '#533BB10D',
        'queue-500': '#533BB1',
      },
    },
  },
  plugins: [],
};
