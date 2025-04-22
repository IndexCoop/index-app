import { Flex } from '@chakra-ui/react'

interface TradePriceProps {
  comparisonLabel: string
  usdLabel: string
}

export const TradePrice = ({ comparisonLabel, usdLabel }: TradePriceProps) => {
  return (
    <Flex align='flex-start' direction={['column', 'row']}>
      <p className='text-ic-gray-600 text-xs font-medium'>{comparisonLabel}</p>
      <p className='text-ic-gray-400 ml-0 text-xs font-medium sm:ml-1'>
        {usdLabel}
      </p>
    </Flex>
  )
}
