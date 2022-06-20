import { Box, Flex, Text } from '@chakra-ui/react'

export interface TradeInfoItem {
  title: string
  values: string[]
}

const excludeBuyAmountItem = (tradeInfoItem: TradeInfoItem): boolean =>
  tradeInfoItem.title !== 'Buy Amount'

const TradeInfoItemRow = ({ title, values }: TradeInfoItem) => {
  return (
    <Flex direction='column'>
      <Text fontSize='14px' fontWeight='500'>
        {title}
      </Text>
      {values.map((value, index) => (
        <Text key={index} fontSize='20px' fontWeight='700'>
          {value}
        </Text>
      ))}
    </Flex>
  )
}

const TradeInfo = (props: { data: TradeInfoItem[] }) => {
  return (
    <Flex direction='column'>
      {props.data.filter(excludeBuyAmountItem).map((item, index) => (
        <Box key={index} mb='16px'>
          <TradeInfoItemRow title={item.title} values={item.values} />
        </Box>
      ))}
    </Flex>
  )
}

export default TradeInfo
