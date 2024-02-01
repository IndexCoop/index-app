import Image from 'next/image'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Text } from '@chakra-ui/react'

import { Token } from '@/constants/tokens'
import { colors } from '@/lib/styles/colors'

import { Caption } from './caption'
import { QuoteResult } from './quote'

interface TradeOutputProps {
  caption: string
  selectedToken: Token
  onSelectToken: () => void
}

export const TradeOutput = (props: TradeOutputProps) => {
  const { selectedToken } = props
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
        <Text color={colors.icGray500} fontSize='sm'>
          Select your preferred route
        </Text>
        <QuoteResult
          type={'Flash Mint'}
          isSelected={true}
          quote={{
            isBestQuote: true,
            inputAmount: '9.807 ETH for',
            outputAmount: '189.68 ETHx2',
            feesGas: '$55.12 via Flash Mint',
            feesTotal: '= $10,052.42 after fees',
          }}
        />
        <QuoteResult type={'Swap'} isSelected={true} quote={null} />
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
