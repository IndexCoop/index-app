import { colors } from 'styles/colors'

export const global = (props: { colorMode: string }) => ({
  body: {
    bg: props.colorMode === 'dark' ? colors.background : '#fff',
    color: props.colorMode === 'dark' ? colors.icWhite : colors.black,
  },
})
