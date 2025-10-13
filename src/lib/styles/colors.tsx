import tailwindConfig from './tailwind.config'

export const colors = {
  ic: tailwindConfig.theme.extend.colors.ic,
  // not verified with designer (will be replaced soon)
  icGrayLightMode: '#aaa',
  icGrayDarkMode: '#777',
}

export const colorStyles = (isDarkMode: boolean) => {
  return {
    background: isDarkMode ? colors.ic.black : colors.ic.white,
    backgroundGradient: isDarkMode
      ? 'linear(to-tr, #143438, #0F1717, #0F1717)'
      : 'linear(to-tr, #F7F8F8, #FCFFFF, #FCFFFF)',
    backgroundInverted: isDarkMode ? colors.ic.white : colors.ic.black,
    border: isDarkMode ? colors.ic.gray[900] : colors.ic.gray[100],
    text: isDarkMode ? colors.ic.white : colors.ic.black,
    text2: isDarkMode ? colors.ic.gray[400] : colors.ic.gray[900],
    text3: colors.ic.gray[600],
    textInverted: isDarkMode ? colors.ic.black : colors.ic.white,
  }
}
