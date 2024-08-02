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
      // need to set bg color here, as otherwise the arrow won't display correctly
      bgColor={colors.ic.white}
      className='bg-ic-white text-ic-gray-600 rounded-md px-4 py-3 text-[11px] font-medium'
      hasArrow
      label={tooltip}
      placement='right-end'
    >
      <Flex cursor={cursor} direction='row' justifyContent={'space-between'}>
        <Flex align='center'>
          <Text
            fontSize='12px'
            fontWeight='500'
            textColor={colors.ic.gray[400]}
          >
            {title}
          </Text>
        </Flex>
        {isLoading && <StyledSkeleton width={60} />}
        {!isLoading && isLink === true && (
          <Link isExternal href={values[1]}>
            <Text
              fontSize='12px'
              fontWeight='700'
              textColor={colors.ic.gray[600]}
            >
              {shortenAddress(values[0])}
            </Text>
          </Link>
        )}
        {!isLoading && (isLink === undefined || isLink === false) && (
          <Flex>
            {values.map((value, index) => (
              <Flex key={index} flexDir={'row'}>
                <Text
                  fontSize='12px'
                  fontWeight='700'
                  textColor={colors.ic.gray[600]}
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
        <Box key={index} mb={'0'} paddingTop={index === 0 ? '0' : '16px'}>
          <TradeInfoItemRow item={item} isLoading={isLoading} />
        </Box>
      ))}
    </Flex>
  )
}
