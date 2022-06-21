import { Box, Flex, Text } from '@chakra-ui/react'

export interface TradeInfoItem {
  title: string
  values: string[]
  valuesColor?: string
}

const TradeInfoItemRow = ({ item }: { item: TradeInfoItem }) => {
  const { title, values, valuesColor } = item
  return (
    <Flex direction='column'>
      <Text fontSize='14px' fontWeight='500'>
        {title}
      </Text>
      {values.map((value, index) => (
        <Text key={index} fontSize='20px' fontWeight='700' color={valuesColor}>
          {value}
        </Text>
      ))}
    </Flex>
  )
}

const TradeInfo = ({ data }: { data: TradeInfoItem[] }) => {
  return (
    <Flex direction='column'>
      {data.map((item, index) => (
        <Box key={index} mb='16px'>
          <TradeInfoItemRow item={item} />
        </Box>
      ))}
    </Flex>
  )
}

export default TradeInfo
