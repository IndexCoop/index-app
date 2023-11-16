import { Box, Flex, Link, Text, Tooltip } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'
import { shortenAddress } from '@/lib/utils'

export interface TradeInfoItem {
  isLink?: boolean
  title: string
  values: string[]
  tooltip?: string
}

const TradeInfoItemRow = (props: { item: TradeInfoItem }) => {
  const { title, values, tooltip, isLink } = props.item
  const cursor = tooltip && tooltip.length > 0 ? 'pointer' : 'default'
  return (
    <Tooltip
      bg={colors.icGray1}
      borderRadius='4px'
      fontSize={'11px'}
      label={tooltip}
      p='12px 20px'
      placement='right-end'
      textColor={colors.icGray3}
    >
      <Flex cursor={cursor} direction='row' justifyContent={'space-between'}>
        <Flex align='center'>
          <Text fontSize='12px' fontWeight='500' textColor={colors.icGray2}>
            {title}
          </Text>
        </Flex>
        {isLink === true && (
          <Link isExternal href={values[1]}>
            <Text fontSize='12px' fontWeight='700' textColor={colors.icGray3}>
              {shortenAddress(values[0])}
            </Text>
          </Link>
        )}
        {isLink === undefined && (
          <Flex>
            {values.map((value, index) => (
              <Flex key={index} flexDir={'row'}>
                <Text
                  fontSize='12px'
                  fontWeight='700'
                  textColor={colors.icGray3}
                >
                  {value}
                </Text>
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>
    </Tooltip>
  )
}

export const TradeInfoItemsContainer = ({
  items,
}: {
  items: TradeInfoItem[]
}) => {
  return (
    <Flex direction='column'>
      {items.map((item, index) => (
        <Box
          key={index}
          mb={index < items.length - 1 ? '20px' : '0'}
          borderTop={
            index === items.length - 1 || index === 0
              ? '1px solid #E7F0F1'
              : 'none'
          }
          paddingTop={index === items.length - 1 || index === 0 ? '16px' : '0'}
        >
          <TradeInfoItemRow item={item} />
        </Box>
      ))}
    </Flex>
  )
}
