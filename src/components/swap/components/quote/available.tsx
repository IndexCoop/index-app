import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

import { Quote } from './types'

type QuoteAvailableProps = {
  type: string
  isSelected: boolean
  quote: Quote
}

function getBackgroundColor(isSelected: boolean, isBestQuote: boolean) {
  // return for best quote (whether selected or not)
  if (isBestQuote) return '#F0FEFF'
  if (!isBestQuote && isSelected) return '#FFF5FA'
  return colors.icGray50
}

function getHighlightColor(isSelected: boolean, isBestQuote: boolean) {
  if (isBestQuote && isSelected) return colors.icBlue6
  if (isBestQuote && !isSelected) return '#CFF5F6'
  if (!isBestQuote && isSelected) {
    return '#F178B6'
  }
  return colors.icWhite
}

export const QuoteAvailable = (props: QuoteAvailableProps) => {
  const { type, isSelected, quote } = props
  const background = getBackgroundColor(isSelected, quote.isBestQuote)
  const highlight = getHighlightColor(isSelected, quote.isBestQuote)
  const borderWidth = isSelected ? 2 : 0
  return (
    <Flex
      bg={background}
      borderColor={highlight}
      borderRadius='12'
      borderWidth={borderWidth}
      direction={'column'}
    >
      <Flex align='flex-end' direction='row'>
        <Text fontSize={'sm'} fontWeight={600} textColor={colors.icGray4}>
          {type.toUpperCase()}
        </Text>
      </Flex>
      <Text fontSize={'md'} fontWeight={500} textColor={colors.icGray5}>
        Swap unavailable
      </Text>
    </Flex>
  )
}
