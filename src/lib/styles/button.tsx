import { colors } from './colors'

export const Button = {
  baseStyle: {
    border: '1px solid',
    borderRadius: 8,
    fontSize: 'md',
    fontWeight: 'bold',
    px: 6,
    py: 4,
    _disabled: {
      backgroundColor: 'rgba(132, 132, 132, 0.12)',
      borderColor: '#555555',
      color: '#555555',
    },
  },
  variants: {
    green: {
      backgroundColor: 'rgba(9, 170, 116, 0.12)',
      borderColor: colors.icMalachite,
      color: colors.icMalachite,
    },
    highlight: ({ colorMode }: { colorMode: string }) => ({
      backgroundColor: 'transparent',
      borderColor: colorMode === 'dark' ? colors.icGray1 : colors.icGray2,
      color: colorMode === 'dark' ? colors.icGray1 : colors.icGray2,
    }),
    highlightSelected: ({ colorMode }: { colorMode: string }) => ({
      backgroundColor: colorMode === 'dark' ? colors.icGray1 : colors.icGray2,
      borderColor: colorMode === 'dark' ? colors.icGray1 : colors.icGray2,
      color: colorMode === 'dark' ? colors.icBlack : colors.icWhite,
    }),
  },
  defaultProps: {
    variant: 'highlight',
  },
}

export const headerButtonHover = {
  transform:
    'translate3d(0px, 2px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
  transformStyle: 'preserve-3d',
}
