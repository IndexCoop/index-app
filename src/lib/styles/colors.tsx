import { theme } from '@chakra-ui/react'

import tailwindConfig from './tailwind.config'

export const colors = {
  ...theme.colors,
  ic: tailwindConfig.theme.extend.colors.ic,
  icGray1: '#EBF2F2',
  icGray2: '#A6B2B2',
  icGray3: '#627171',
  icGray4: '#2C3333',
  icWhite: '#FCFFFF',
  // not verified with designer (will be replaced soon)
  icGrayLightMode: '#aaa',
  icGrayDarkMode: '#777',
}

export const colorStyles = (isDarkMode: boolean) => {
  return {
    background: isDarkMode ? colors.ic.black : colors.icWhite,
    backgroundGradient: isDarkMode
      ? 'linear(to-tr, #143438, #0F1717, #0F1717)'
      : 'linear(to-tr, #F7F8F8, #FCFFFF, #FCFFFF)',
    backgroundInverted: isDarkMode ? colors.icWhite : colors.ic.black,
    border: isDarkMode ? colors.icGray4 : colors.icGray1,
    text: isDarkMode ? colors.icWhite : colors.ic.black,
    text2: isDarkMode ? colors.icGray2 : colors.icGray4,
    text3: colors.icGray3,
    textInverted: isDarkMode ? colors.ic.black : colors.icWhite,
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
