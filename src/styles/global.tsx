import { colors } from 'styles/colors'

export const global = (props: { colorMode: string }) => ({
  body: {
    bg: props.colorMode === 'dark' ? colors.background : '#fff',
    bgGradient:
      props.colorMode === 'dark'
        ? `linear(to-b, ${colors.background}, #050233)`
        : '#fff',
    color: props.colorMode === 'dark' ? colors.icWhite : colors.black,
  },
})
