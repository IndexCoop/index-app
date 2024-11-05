import defaultTheme from 'tailwindcss/defaultTheme'

import type { Config } from 'tailwindcss'

export default {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        ic: {
          dark: '#141E1F',
          black: '#0F1717',
          green: '#09AA74',
          red: '#C32238',
          yellow: '#ECB424',
          white: '#FCFFFF',
          blue: {
            50: '#f1fffd',
            100: '#d1f9f6',
            200: '#b3f2f2',
            300: '#84e9e9',
            400: '#44d7d7',
            500: '#00bec2',
            600: '#15CDD1',
            700: '#008f92',
            800: '#006a71',
            900: '#004d53',
            950: '#143438',
          },
          gray: {
            50: '#f2f8f8',
            100: '#ebf2f2',
            200: '#e0ecec',
            300: '#cfdada',
            400: '#a6b4b4',
            500: '#859292',
            600: '#627171',
            700: '#4e6060',
            800: '#364746',
            900: '#253333',
            950: '#1c2929',
          },
        },
      },
      fontFamily: {
        sans: ['Open Sauce Sans', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      },
      animation: {
        shine: 'shine 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
