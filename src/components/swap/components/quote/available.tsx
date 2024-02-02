import Image from 'next/image'
import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

import { QuoteDisplay } from './types'

type QuoteAvailableProps = {
  type: string
  isSelected: boolean
  quote: QuoteDisplay
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
      p='16px'
      w='100%'
      h='110px'
    >
      <Flex align='space-between' direction='column' justify={'flex-start'}>
        <Flex justify={'space-between'}>
          <Text fontSize={'xs'} fontWeight={500} textColor={colors.icGray500}>
            {quote.inputAmount}
          </Text>
          <Text fontSize={'sm'} fontWeight={600} textColor={highlight}>
            {type.toUpperCase()}
          </Text>
        </Flex>
      </Flex>
      <Text
        fontSize={'2xl'}
        fontWeight={500}
        // mt='16px'
        // mb='20px'
        textColor={colors.icGray800}
      >
        {quote.outputAmount}
      </Text>
      <Flex justify={'space-between'}>
        <Text fontSize={'xs'} fontWeight={500} textColor={colors.icGray500}>
          {quote.feesTotal}
        </Text>
        <Flex direction={'row'} gap='6px'>
          <Image
            alt='Gas fees icon'
            src={'/assets/gas-icon.svg'}
            height={10}
            width={10}
            style={{ color: colors.icGray500 }}
          />
          <Text fontSize={'xs'} fontWeight={500} textColor={colors.icGray500}>
            {quote.feesGas}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
