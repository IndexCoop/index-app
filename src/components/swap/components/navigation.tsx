import { Text } from '@chakra-ui/react'

import { Settings } from '@/components/settings'
import { useSlippage } from '@/lib/providers/slippage'
import { colors } from '@/lib/styles/colors'

export function SwapNavigation() {
  const {
    auto: autoSlippage,
    isAuto: isAutoSlippage,
    set: setSlippage,
    slippage,
  } = useSlippage()
  return (
    <div className='flex flex-row justify-between'>
      <Text
        color={colors.ic.gray[900]}
        fontSize={'md'}
        fontWeight={500}
        ml={'12px'}
        my={'16px'}
      >
        Swap
      </Text>
      <Settings
        isAuto={isAutoSlippage}
        isDarkMode={false}
        slippage={slippage}
        onChangeSlippage={setSlippage}
        onClickAuto={autoSlippage}
      />
    </div>
  )
}
