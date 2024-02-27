import { colors } from './colors'

export const Heading = {
  baseStyle: ({ colorMode }: { colorMode: string }) => ({
    color: colorMode === 'dark' ? colors.ic.white : colors.ic.black,
  }),
}
