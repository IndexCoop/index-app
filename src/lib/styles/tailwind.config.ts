import defaultTheme from 'tailwindcss/defaultTheme'

import type { Config } from 'tailwindcss'

export default {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'selector',
  safelist: [{ pattern: /^bg-/ }, { pattern: /^text-/ }],
  theme: {
    extend: {
      screens: {
        xs: '475px',
        lgn: '1080px',
      },
      colors: {
        ic: {
          black: '#0F1717',
          green: '#09AA74',
          red: '#C32238',
          yellow: '#ECB424',
          white: '#FCFFFF',
          pill: {
            teal: '#3C6073',
          },
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
            975: '#161f1f',
          },
        },
      },
      fontFamily: {
        sans: ['Open Sauce Sans', ...defaultTheme.fontFamily.sans],
      },

      keyframes: {
        grow: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      },
      animation: {
        grow: 'grow 3s ease-in-out infinite',
        shine: 'shine 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
