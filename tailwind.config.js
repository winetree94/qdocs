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
      fontSize: {
        '20': ['20px', '28px'],
        '18': ['18px', '26px'],
        '16': ['16px', '24px'],
        '14': ['14px', '22px'],
        '12': ['12px', '20px'],
        '10': ['10px', '18px'],
        '8': ['8px', '16px'],
      },
    },
  },
  plugins: [],
};
