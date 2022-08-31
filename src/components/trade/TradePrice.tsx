import { useColorStyles } from 'styles/colors'

import { Flex, Text } from '@chakra-ui/react'

type TradePriceProps = {
  comparisonLabel: string
  usdLabel: string
}

export const TradePrice = ({ comparisonLabel, usdLabel }: TradePriceProps) => {
  const { styles } = useColorStyles()
  return (
    <Flex>
      <Text color={styles.text} fontSize='12px'>
        {comparisonLabel}
      </Text>
      <Text color={styles.text2} fontSize='12px' ml='4px'>
        {usdLabel}
      </Text>
    </Flex>
  )
}
