import { LinearGradient } from '@visx/gradient'

type Props = {
  isDark: boolean
}

export function LinearGradientFill({ isDark }: Props) {
  return (
    <LinearGradient
      from={isDark ? '#84e9e9' : '#15CDD1'}
      to={isDark ? '#143438' : '#f1fffd'}
      id='gradient'
      fromOpacity={0.2}
      toOpacity={0.1}
    />
  )
}
