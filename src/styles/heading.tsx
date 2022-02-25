import { colors } from 'styles/colors'

export const Heading = {
  baseStyle: ({ colorMode }: { colorMode: string }) => ({
    color: colorMode === 'dark' ? colors.icWhite : colors.black,
  }),
}
