import { Box, Flex, Text } from '@chakra-ui/react'

export interface TradeInfoItem {
  title: string
  value: string
}

const excludeBuyAmountItem = (tradeInfoItem: TradeInfoItem): boolean =>
  tradeInfoItem.title !== 'Buy Amount'

const TradeInfoItemRow = ({ title, value }: TradeInfoItem) => {
  const formatIfNumber = (value: string) => {
    if (/[a-z]/i.test(value)) return value

    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })
  }
  if (title === 'Offered From') {
    const vals = value.split(',')

    return (
      <Flex direction='column'>
        <Text fontSize='14px' fontWeight='500'>
          {title}
        </Text>
        {vals.map((dex, index) => (
          <Text key={index} fontSize='20px' fontWeight='700'>
            {dex}
          </Text>
        ))}
      </Flex>
    )
  }
  return (
    <Flex direction='column'>
      <Text fontSize='14px' fontWeight='500'>
        {title}
      </Text>
      <Text fontSize='20px' fontWeight='700'>
        {formatIfNumber(value)}
      </Text>
    </Flex>
  )
}

const TradeInfo = (props: { data: TradeInfoItem[] }) => {
  return (
    <Flex direction='column'>
      {props.data.filter(excludeBuyAmountItem).map((item, index) => (
        <Box key={index} mb='16px'>
          <TradeInfoItemRow title={item.title} value={item.value} />
        </Box>
      ))}
    </Flex>
  )
}

export default TradeInfo
