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
        'gray-400': '#edecf0',
        'queue-400': '#533BB10D',
        'queue-500': '#533BB1',
      },
      fontSize: {
        '20': ['20px', '24px'],
        '18': ['18px', '22px'],
        '16': ['16px', '20px'],
        '14': ['14px', '18px'],
        '12': ['12px', '16px'],
        '10': ['10px', '14px'],
        '8': ['8px', '12x'],
      },
    },
  },
  plugins: [],
};
