import { theme, useColorMode } from '@chakra-ui/react'

export const colors = {
  ...theme.colors,
  background: '#000000',
  // old colors will be removed once they are replaced everywhere
  icApricot: '#FF8A7D',
  icLazurite: '#433BCE',
  icMalachite: '#09AA74',
  icPeriwinkle: '#B9B6FC',
  icRed: '#C32238',
  // the new colors
  icBlack: '#0F1717',
  icBlue: '#00BEC2', // highlight
  icBlue1: '#05ACAF',
  icBlue2: '#008F92',
  icBlue3: '#006A71',
  icBlue4: '#004D53',
  icBlue5: '#143438',
  icGray1: '#EBF2F2',
  icGray2: '#A6B2B2',
  icGray3: '#627171',
  icGray4: '#2C3333',
  icWhite: '#FCFFFF',
  // not verified with designer
  icGrayLightMode: '#aaa',
  icGrayDarkMode: '#777',
}

export const useICColorMode = () => {
  const { colorMode } = useColorMode()
  const isDarkMode = colorMode === 'dark'
  const dividerColor = isDarkMode ? colors.icWhite : colors.black
  return { isDarkMode, dividerColor }
}

export const pieChartColors = [
  '#2328cd',
  '#f433f0',
  '#6c1547',
  '#30f055',
  '#f50adf',
  '#ac61ce',
  '#7b5e46',
  '#52abf3',
  '#4d6f9c',
  '#1eb772',
  '#4cb44e',
  '#621ecc',
  '#2cfe98',
  '#9f4273',
  '#bfa426',
  '#3822ec',
  '#e053d0',
  '#e69da5',
  '#19935b',
  '#5aa382',
  '#a2b54f',
  '#63aef6',
  '#7e460a',
  '#9d720f',
  '#f12c3c',
  '#5dd5ba',
  '#5190db',
  '#c7a9a3',
  '#f72398',
  '#51c574',
  '#9f5c34',
  '#4cbf4b',
  '#7fca7d',
  '#bcb619',
  '#f31a2e',
  '#fb98ad',
  '#a07ed9',
  '#867259',
  '#c43c35',
  '#aed1b7',
  '#edd58d',
  '#b5de20',
  '#7e8ac3',
  '#c1bfc8',
  '#5a8ebb',
  '#d8355c',
  '#64a9c9',
  '#9c9bf8',
  '#bb8002',
  '#68a0ce',
]
