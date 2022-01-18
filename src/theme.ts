import { Button } from 'styles/button'

import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const components = {
  Button,
}

const theme = extendTheme({ config, components })

export default theme
