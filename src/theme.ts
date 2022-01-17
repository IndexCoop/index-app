import { extendTheme, ThemeConfig } from '@chakra-ui/react'

import { Button } from 'styles/button'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const components = {
  Button,
}

const theme = extendTheme({ config, components })

export default theme
