import { Global } from '@emotion/react'

export const fonts = {
  heading: 'Open Sauce SemiBold, sans-serif',
  body: 'Open Sauce, sans-serif',
  text: 'Open Sauce, sans-serif',
}

export const GlobalFonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Open Sauce SemiBold';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('./fonts/OpenSauceOne-SemiBold.ttf') format('ttf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Open Sauce Medium';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url('./fonts/OpenSauceOne-Medium.ttf') format('ttf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Open Sauce';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('./fonts/OpenSauceOne-Regular.ttf') format('ttf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Open Sauce Light';
        font-style: normal;
        font-weight: 100;
        font-display: swap;
        src: url('./fonts/OpenSauceOne-Regular.ttf') format('ttf');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      `}
  />
)
