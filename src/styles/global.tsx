import { colorStyles } from 'styles/colors'

export const global = (props: { colorMode: string }) => ({
  body: {
    bg: colorStyles(props.colorMode === 'dark').background,
    color: colorStyles(props.colorMode === 'dark').text,
  },
})
