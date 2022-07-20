import merge from 'lodash.merge'
import { Button } from 'styles/button'
import { colors } from 'styles/colors'
import { fonts } from 'styles/fonts'
import { global } from 'styles/global'
import { Heading } from 'styles/heading'
import { Tabs } from 'styles/tabs'
import { Text } from 'styles/text'

import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import { midnightTheme, Theme } from '@rainbow-me/rainbowkit'

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: false,
}

const components = {
  Button,
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
  midnightTheme({
    borderRadius: 'medium',
  }),
  {
    colors: {
      accentColor: colors.icBlue,
      accentColorForeground: colors.icWhite,
      generalBorder: colors.icWhite,
      modalBorder: colors.icWhite,
    },
  } as Theme
)

export default theme
