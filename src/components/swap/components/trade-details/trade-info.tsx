import { Box, Flex, Link, Text, Tooltip } from '@chakra-ui/react'

import { StyledSkeleton } from '@/components/skeleton'
import { colors } from '@/lib/styles/colors'
import { shortenAddress } from '@/lib/utils'

import { TradeInfoItem } from '../../types'

type TradeInfoItemRowProps = {
  item: TradeInfoItem
  isLoading: boolean
}

const TradeInfoItemRow = (props: TradeInfoItemRowProps) => {
  const { isLoading, item } = props
  const { title, values, tooltip, isLink } = item
  const cursor = tooltip && tooltip.length > 0 ? 'pointer' : 'default'
  return (
    <Tooltip
      bg={colors.icWhite}
      borderRadius='6px'
      fontSize={'11px'}
      fontWeight={500}
      hasArrow
      label={tooltip}
      p='12px 16px'
      placement='right-end'
      textColor={colors.icGray3}
    >
      <Flex cursor={cursor} direction='row' justifyContent={'space-between'}>
        <Flex align='center'>
          <Text fontSize='12px' fontWeight='500' textColor={colors.icGray2}>
            {title}
          </Text>
        </Flex>
        {isLoading && <StyledSkeleton width={60} />}
        {!isLoading && isLink === true && (
          <Link isExternal href={values[1]}>
            <Text fontSize='12px' fontWeight='700' textColor={colors.icGray3}>
              {shortenAddress(values[0])}
            </Text>
          </Link>
        )}
        {!isLoading && isLink === undefined && (
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

type TradeInfoItemsContainerProps = {
  items: TradeInfoItem[]
  isLoading: boolean
}

export const TradeInfoItemsContainer = ({
  isLoading,
  items,
}: TradeInfoItemsContainerProps) => {
  return (
    <Flex direction='column'>
      {items.map((item, index) => (
        <Box
          key={index}
          mb={index < items.length - 1 ? '20px' : '0'}
          paddingTop={index === items.length - 1 || index === 0 ? '16px' : '0'}
        >
          <TradeInfoItemRow item={item} isLoading={isLoading} />
        </Box>
      ))}
    </Flex>
  )
}
