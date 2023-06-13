import { colors } from './colors'

export const Heading = {
  baseStyle: ({ colorMode }: { colorMode: string }) => ({
    color: colorMode === 'dark' ? colors.icWhite : colors.black,
  }),
}
