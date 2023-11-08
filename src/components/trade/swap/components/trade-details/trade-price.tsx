import { Flex, Text } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

interface TradePriceProps {
  comparisonLabel: string
  usdLabel: string
}

export const TradePrice = ({ comparisonLabel, usdLabel }: TradePriceProps) => {
  return (
    <Flex align='flex-start' direction={['column', 'row']}>
      <Text fontSize='12px' fontWeight={500} textColor={colors.icGray3}>
        {comparisonLabel}
      </Text>
      <Text
        fontSize='12px'
        fontWeight={500}
        textColor={colors.icGray2}
        ml={[0, '4px']}
      >
        {usdLabel}
      </Text>
    </Flex>
  )
}
