import Image from 'next/image'
import { Flex, Text } from '@chakra-ui/react'

import { StyledSkeleton } from '@/components/skeleton'
import { colors } from '@/lib/styles/colors'

import { QuoteDisplay } from './types'

type QuoteAvailableProps = {
  type: string
  isLoading: boolean
  isSelected: boolean
  quote: QuoteDisplay | null
  onClick: () => void
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
  return colors.icGray400
}

export const QuoteAvailable = (props: QuoteAvailableProps) => {
  const { type, isLoading, isSelected, onClick, quote } = props
  const background = getBackgroundColor(isSelected, quote?.isBestQuote ?? false)
  const highlight = getHighlightColor(isSelected, quote?.isBestQuote ?? false)
  const borderWidth = isSelected ? 2 : 0
  return (
    <Flex
      bg={background}
      borderColor={highlight}
      borderRadius='12'
      borderWidth={borderWidth}
      cursor='pointer'
      direction={'column'}
      p='16px'
      w='100%'
      h='110px'
      onClick={onClick}
    >
      <Flex align='space-between' direction='column' justify={'flex-start'}>
        <Flex justify={'space-between'}>
          <Text fontSize={'xs'} fontWeight={500} textColor={colors.icGray500}>
            {isLoading && <StyledSkeleton width={50} />}
            {!isLoading && quote && quote.inputAmount}
          </Text>
          <Flex direction={'row'} gap={1}>
            {quote?.isBestQuote && (
              <Flex opacity={isSelected ? 1 : 0.2}>
                <Image
                  src={'/assets/icon-trophy.svg'}
                  alt={'token icon'}
                  width={12}
                  height={12}
                />
              </Flex>
            )}
            <Text fontSize={'sm'} fontWeight={600} textColor={highlight}>
              {type.toUpperCase()}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Text
        fontSize={'2xl'}
        fontWeight={500}
        textColor={!isSelected ? colors.icGray500 : colors.icGray800}
      >
        {isLoading && <StyledSkeleton width={200} />}
        {!isLoading && quote && quote.outputAmount}
      </Text>
      <Flex justify={'space-between'}>
        <Text fontSize={'xs'} fontWeight={500} textColor={colors.icGray500}>
          {isLoading && <StyledSkeleton width={80} />}
          {!isLoading && quote && quote.feesTotal}
        </Text>
        {quote && (
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
        )}
      </Flex>
    </Flex>
  )
}
