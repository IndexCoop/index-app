import { Text, Tooltip } from '@chakra-ui/react'

import { colors } from '@/lib/styles/colors'

export const FlashMintTag = () => (
  <Tooltip
    className='bg-ic-white'
    borderRadius='6px'
    fontSize={'11px'}
    fontWeight={500}
    hasArrow
    label={
      'Flash Mint enables users to indirectly buy components of an Index token and then mint a new unit, providing significant cost savings and deep liquidity for large cryptocurrency trades.'
    }
    p='12px 16px'
    placement='right-end'
    textColor={colors.icGray3}
  >
    <Text fontSize='12px' fontWeight={600} textColor={colors.icGray3}>
      Flash Mint
    </Text>
  </Tooltip>
)
