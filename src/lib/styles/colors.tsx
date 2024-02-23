import { theme } from '@chakra-ui/react'

export const colors = {
  ...theme.colors,
  // old colors will be removed once they are replaced everywhere
  icMalachite: '#09AA74',
  icYellow: '#ECB424',
  icRed: '#C32238',
  // the new colors
  icBlack: '#0F1717',
  // TODO: replace with static config
  icBlue: '#00BEC2', // highlight
  icGray1: '#EBF2F2',
  icGray2: '#A6B2B2',
  icGray3: '#627171',
  icGray4: '#2C3333',
  icGray400: '#A6B4B4',
  icGray5: '#CFD9D9',
  icGray50: '#F2F8F8',
  icGray500: '#859292',
  icGray600: '#627171',
  icGray800: '##364746',
  icWhite: '#FCFFFF',
  // not verified with designer (will be replaced soon)
  icGrayLightMode: '#aaa',
  icGrayDarkMode: '#777',
}

export const colorStyles = (isDarkMode: boolean) => {
  return {
    background: isDarkMode ? colors.icBlack : colors.icWhite,
    backgroundGradient: isDarkMode
      ? 'linear(to-tr, #143438, #0F1717, #0F1717)'
      : 'linear(to-tr, #F7F8F8, #FCFFFF, #FCFFFF)',
    backgroundInverted: isDarkMode ? colors.icWhite : colors.icBlack,
    border: isDarkMode ? colors.icGray4 : colors.icGray1,
    text: isDarkMode ? colors.icWhite : colors.icBlack,
    text2: isDarkMode ? colors.icGray2 : colors.icGray4,
    text3: colors.icGray3,
    textInverted: isDarkMode ? colors.icBlack : colors.icWhite,
  }
}

export const useColorStyles = () => {
  const { isDarkMode } = useICColorMode()
  return {
    isDarkMode,
    styles: colorStyles(isDarkMode),
  }
}

export const useICColorMode = () => {
  // const { colorMode } = useColorMode()
  const isDarkMode = false
  return { isDarkMode }
}
