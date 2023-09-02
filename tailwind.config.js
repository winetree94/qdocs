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
        white: {
          '100': '#FFFFFF',
        },
        gray: {
          '200': '#F2F2F2',
          '400': '#EDECF0',
          '500': '#E7E6EB',
          '600': '#CCCCCC',
          '650': '#C3C3C3',
          '660': '#D9D9D9',
          '700': '#A6A6A6',
          '800': '#9D9D9D',
          '900': '#808080',
        },
        blue: {
          '100': '#E4E4F0',
          '200': '#D4D4E0',
          '300': '#BEBEC8',
          '400': '#A6A6B5',
          '500': '#A2A3C3',
        },
        queue: {
          '300': '#7D7EFF',
          '400': '#533BB1',
          '500': '#533BB1',
        },
        black: {
          '900': '#000000',
        }
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
