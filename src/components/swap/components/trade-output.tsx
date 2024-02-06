import { Flex, Text } from '@chakra-ui/react'

import { Token } from '@/constants/tokens'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { colors } from '@/lib/styles/colors'

import { FormattedQuoteDisplay } from '../hooks/use-swap/formatters/result'
import { Caption } from './caption'
import { QuoteResult } from './quote-result'
import { SelectorButton } from './selector-button'

interface TradeOutputProps {
  caption: string
  selectedToken: Token
  selectedQuote: QuoteType | null
  quotes: FormattedQuoteDisplay[]
  onSelectQuote: (quoteType: QuoteType) => void
  onSelectToken: () => void
}

export const TradeOutput = (props: TradeOutputProps) => {
  const { selectedQuote, selectedToken } = props
  return (
    <Flex
      bg={colors.icWhite}
      border={'1px solid'}
      borderColor={colors.icGray1}
      borderRadius={12}
      direction={'column'}
      p={'16px 20px'}
    >
      <Caption caption={props.caption} />
      <Flex justify='flex-end' w='100%'>
        <SelectorButton
          image={selectedToken.image}
          symbol={selectedToken.symbol}
          onClick={props.onSelectToken}
        />
      </Flex>
      <Flex direction='column' gap='8px' mt='20px'>
        {props.quotes.length > 0 && (
          <Text color={colors.icGray600} fontSize='xs' fontWeight={500}>
            Select your preferred route
          </Text>
        )}
        {props.quotes.map((formattedQuote) => (
          <QuoteResult
            key={formattedQuote.type}
            type={formattedQuote.type}
            isLoading={formattedQuote.isLoading}
            isSelected={selectedQuote === formattedQuote.quote?.type}
            quote={formattedQuote.quote ?? null}
            onClick={() => {
              if (formattedQuote.quote) {
                props.onSelectQuote(formattedQuote.quote.type)
              }
            }}
          />
        ))}
      </Flex>
    </Flex>
  )
}
