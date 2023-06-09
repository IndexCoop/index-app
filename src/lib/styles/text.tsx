import { colors } from './colors'

export const Text = {
  baseStyle: ({ colorMode }: { colorMode: string }) => ({
    color: colorMode === 'dark' ? colors.icWhite : colors.black,
  }),
  variants: {
    secondary: {
      color: '#848484',
    },
  },
}
