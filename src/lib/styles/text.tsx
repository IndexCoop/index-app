import { colors } from './colors'

export const Text = {
  baseStyle: ({ colorMode }: { colorMode: string }) => ({
    color: colorMode === 'dark' ? colors.ic.white : colors.ic.black,
  }),
  variants: {
    secondary: {
      color: '#848484',
    },
  },
}
