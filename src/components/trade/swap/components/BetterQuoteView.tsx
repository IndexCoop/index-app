import { colors } from '@/lib/styles/colors'

import { CheckIcon, ChevronRightIcon, InfoIcon } from '@chakra-ui/icons'
import { Flex, Spinner, Text } from '@chakra-ui/react'

export enum BetterQuoteState {
  betterQuote,
  betterQuotePriceImpact,
  fetchingQuote,
  noBetterQuote,
}

type BetterQuoteViewProps = {
  onClick: () => void
  state: BetterQuoteState
  savingsUsd: number
}

export const BetterQuoteView = (props: BetterQuoteViewProps) => {
  const isBetterQuotePriceImpact =
    props.state === BetterQuoteState.betterQuotePriceImpact
  const isBetterQuote =
    props.state === BetterQuoteState.betterQuote || isBetterQuotePriceImpact
  return (
    <Flex
      bg={colors.icWhite}
      border='1px solid'
      borderColor={colors.icGray1}
      borderRadius='16px'
      color={colors.icGray4}
      cursor='pointer'
      direction='column'
      onClick={props.onClick}
      p='16px'
    >
      {isBetterQuote && (
        <Flex align='center' justify='space-between'>
          <Flex align='center'>
            <InfoIcon w='5' h='5' />
            <Flex direction='column' ml='16px'>
              <Text color={colors.icGray4}>
                {isBetterQuotePriceImpact
                  ? 'You are saving because of price impact.'
                  : `You are saving $${props.savingsUsd.toFixed(2)}`}
              </Text>
              <Text color={colors.icGray4}>When using Flash Mint.</Text>
            </Flex>
          </Flex>
          <ChevronRightIcon w='5' h='5' />
        </Flex>
      )}
      {props.state === BetterQuoteState.fetchingQuote && (
        <Flex align='center'>
          <Spinner size='sm' />
          <Text ml='16px' color={colors.icGray4}>
            Looking for better quotes...
          </Text>
        </Flex>
      )}
      {props.state === BetterQuoteState.noBetterQuote && (
        <Flex align='center'>
          <CheckIcon w='4' h='4' />
          <Text ml='16px' color={colors.icGray4}>
            You got the best quote.
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
