import { Button } from 'styles/button'
import { colors } from 'styles/colors'
import { Heading } from 'styles/heading'
import { Text } from 'styles/text'

import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const components = {
  Button,
  Heading,
  Text,
}

const theme = extendTheme({
  config,
  colors,
  components,
})

export default theme
