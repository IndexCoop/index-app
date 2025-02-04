import { extendTheme, ThemeConfig } from '@chakra-ui/react'

import { Button } from '../styles/button'
import { Checkbox } from '../styles/checkbox'
import { colors } from '../styles/colors'
import { global } from '../styles/global'
import { Heading } from '../styles/heading'
import { Text } from '../styles/text'

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
  Text,
}

const theme = extendTheme({
  config,
  colors,
  components,
  fonts,
  styles: { global },
})

export default theme
