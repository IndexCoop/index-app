import { colors, useICColorMode } from 'styles/colors'

import { Flex, Text } from '@chakra-ui/react'

import { useSlippage } from 'hooks/useSlippage'

import QuickTrade, { QuickTradeProps } from './QuickTrade'
import { QuickTradeSettingsPopover } from './QuickTradeSettingsPopover'

const QuickTradeContainer = (props: QuickTradeProps) => {
  const { isDarkMode } = useICColorMode()

  const paddingX = props.isNarrowVersion ? '16px' : '40px'

  return (
    <Flex
      border='2px solid #F7F1E4'
      borderColor={isDarkMode ? colors.icWhite : colors.black}
      borderRadius='16px'
      direction='column'
      py='20px'
      px={['16px', paddingX]}
      height={'100%'}
    >
      <Navigation />
      <QuickTrade {...props} />
    </Flex>
  )
}

const Navigation = () => {
  const { isDarkMode } = useICColorMode()
  const {
    auto: autoSlippage,
    isAuto: isAutoSlippage,
    set: setSlippage,
    slippage,
  } = useSlippage()

  return (
    <Flex align='center' justify='space-between'>
      <Text fontSize='24px' fontWeight='700'>
        Quick Trade
      </Text>
      <QuickTradeSettingsPopover
        isAuto={isAutoSlippage}
        isDarkMode={isDarkMode}
        onChangeSlippage={setSlippage}
        onClickAuto={autoSlippage}
        slippage={slippage}
      />
    </Flex>
  )
}

export default QuickTradeContainer
