/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    "../app/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
          '50': '#eff1fe',
          '100': '#e2e5fd',
          '200': '#cbcefa',
          '300': '#abaef6',
          '400': '#8c89f0',
          '500': '#7b6de7',
          '600': '#6b51da',
          '700': '#533BB1',
          '800': '#4b389b',
          '900': '#3f347b',
          '950': '#261e48',
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
