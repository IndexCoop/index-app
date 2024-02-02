import Image from 'next/image'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Text } from '@chakra-ui/react'

import { Token } from '@/constants/tokens'
import { QuoteType } from '@/lib/hooks/use-best-quote/types'
import { colors } from '@/lib/styles/colors'

import { FormattedQuoteDisplay } from '../hooks/use-swap/formatters/result'
import { Caption } from './caption'
import { QuoteResult } from './quote'

interface TradeOutputProps {
  caption: string
  selectedToken: Token
  selectedQuote: QuoteType | null
  quotes: FormattedQuoteDisplay[]
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
        <Text color={colors.icGray600} fontSize='xs' fontWeight={500}>
          Select your preferred route
        </Text>
        {props.quotes.map((formattedQuote) => (
          <QuoteResult
            key={formattedQuote.type}
            type={formattedQuote.type}
            isSelected={selectedQuote === formattedQuote.quote?.type}
            quote={formattedQuote.quote ?? null}
          />
        ))}
      </Flex>
    </Flex>
  )
}

type SelectorProps = {
  onClick: () => void
  image: string
  symbol: string
}

const SelectorButton = ({ image, symbol, onClick }: SelectorProps) => (
  <Flex
    align='center'
    bg={colors.icGray1}
    borderRadius='32'
    cursor='pointer'
    onClick={onClick}
    p='10px'
    shrink={0}
  >
    <Image alt={`${symbol} logo`} src={image} width={20} height={20} />
    <Text color={colors.icBlack} fontSize={'14px'} fontWeight={500} mx='8px'>
      {symbol}
    </Text>
    <ChevronDownIcon w={6} h={6} color={colors.icGray4} />
  </Flex>
)
