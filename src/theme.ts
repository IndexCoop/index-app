import { Button } from 'styles/button'
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

const theme = extendTheme({ config, components })

export default theme
