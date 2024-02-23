import clsx from 'clsx'
import Image from 'next/image'
import { Flex, Text } from '@chakra-ui/react'

import { StyledSkeleton } from '@/components/skeleton'

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
  return '#f2f8f8'
}

function useHighlightColor(isSelected: boolean, isBestQuote: boolean) {
  if (isBestQuote && isSelected) return '#15CDD1'
  if (isBestQuote && !isSelected) return '#CFF5F6'
  if (!isBestQuote && isSelected) {
    return '#F178B6'
  }
  return '#A6B4B4'
}

export const QuoteAvailable = (props: QuoteAvailableProps) => {
  const { type, isLoading, isSelected, onClick, quote } = props
  const background = getBackgroundColor(isSelected, quote?.isBestQuote ?? false)
  const highlight = useHighlightColor(isSelected, quote?.isBestQuote ?? false)
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
          <Text className='text-ic-gray-500' fontSize={'xs'} fontWeight={500}>
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
        className={clsx(isSelected ? 'text-ic-gray-800' : 'text-ic-gray-500')}
        fontSize={'2xl'}
        fontWeight={500}
      >
        {isLoading && <StyledSkeleton width={200} />}
        {!isLoading && quote && quote.outputAmount}
      </Text>
      <Flex
        direction={['column', 'row']}
        justify={['flex-start', 'space-between']}
      >
        <Text className='text-ic-gray-500' fontSize={'xs'} fontWeight={500}>
          {isLoading && <StyledSkeleton width={80} />}
          {!isLoading && quote && quote.feesTotal}
        </Text>
        {quote && (
          <Flex direction='row' gap='6px'>
            <Image
              className='text-ic-gray-500'
              alt='Gas fees icon'
              src={'/assets/gas-icon.svg'}
              height={10}
              width={10}
            />
            <Text className='text-ic-gray-500' fontSize={'xs'} fontWeight={500}>
              {quote.feesGas}
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
