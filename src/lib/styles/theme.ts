import merge from 'lodash.merge'
import { Button } from '../styles/button'
import { Checkbox } from '../styles/checkbox'
import { colors } from '../styles/colors'
import { global } from '../styles/global'
import { Heading } from '../styles/heading'
import { Tabs } from '../styles/tabs'
import { Text } from '../styles/text'

import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { darkTheme, Theme } from '@rainbow-me/rainbowkit'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const fonts = {
  heading: 'Open Sauce Sans, sans-serif',
  body: 'Open Sauce Sans, sans-serif',
  text: 'Open Sauce Sans, sans-serif',
}

const components = {
  Button,
  Checkbox,
  Heading,
  Tabs,
  Text,
}

const theme = extendTheme({
  config,
  colors,
  components,
  fonts,
  styles: { global },
})

export const rainbowkitTheme = merge(
  darkTheme({
    borderRadius: 'medium',
  }),
  {
    colors: {
      accentColor: colors.icBlue,
      accentColorForeground: colors.icWhite,
      actionButtonBorder: colors.icGray4,
      actionButtonBorderMobile: colors.icGray4,
      generalBorder: colors.icGray4,
      modalBorder: colors.icGray4,
      modalBackground: colors.icBlack,
      profileForeground: colors.icBlack,
      closeButtonBackground: colors.icGray4,
    },
    fonts: {
      body: fonts.body,
    },
  } as Theme
)

export default theme
