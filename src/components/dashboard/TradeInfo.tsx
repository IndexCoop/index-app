import { Box, Flex, Text } from '@chakra-ui/react'

export interface TradeInfoItem {
  title: string
  value: string
}

const TradeInfoItemRow = ({ title, value }: TradeInfoItem) => (
  <Flex direction='column'>
    <Text fontSize='14px' fontWeight='500'>
      {title}
    </Text>
    <Text fontSize='20px' fontWeight='700'>
      {value}
    </Text>
  </Flex>
)

const TradeInfo = (props: { data: TradeInfoItem[] }) => {
  return (
    <Flex direction='column'>
      {props.data.map((item, index) => (
        <Box key={index} mb='16px'>
          <TradeInfoItemRow title={item.title} value={item.value} />
        </Box>
      ))}
    </Flex>
  )
}

export default TradeInfo
