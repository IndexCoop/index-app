import { Colors, theme } from '@chakra-ui/react'

interface IndexCoopColors extends Colors {
  icApricot: string
}

export const colors: IndexCoopColors = {
  ...theme.colors,
  icApricot: '#FF8A7D',
  icBlue: '#327EE8',
  icLazurite: '#433BCE',
  icPeriwinkle: '#B9B6FC',
  icYellow: '#FABF00',
}
