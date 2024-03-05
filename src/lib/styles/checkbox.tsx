import { colors } from './colors'

export const Checkbox = {
  baseStyle: ({ colorMode }: { colorMode: string }) => ({
    icon: {
      color: colors.ic.white,
    },
    control: {
      border: '1px',
      borderColor: colorMode === 'dark' ? colors.ic.white : colors.ic.black,
      borderRadius: 'base',
    },
    label: {
      color: colorMode === 'dark' ? colors.ic.white : colors.ic.black,
    },
  }),
}
