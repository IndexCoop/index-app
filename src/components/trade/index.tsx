import { useState } from 'react'

import { colors, useICColorMode } from 'styles/colors'
import { useNetwork } from 'wagmi'

import { Flex, Text } from '@chakra-ui/react'

import { SlippageProvider, useSlippage } from 'providers/Slippage'

import FlashMint from './FlashMint'
import QuickTrade, { QuickTradeProps } from './QuickTrade'
import { QuickTradeSettingsPopover } from './QuickTradeSettingsPopover'

enum TradeType {
  flashMint,
  swap,
}

const QuickTradeContainer = (props: QuickTradeProps) => {
  const { isDarkMode } = useICColorMode()
  const [selectedType, setSelectedType] = useState<TradeType>(TradeType.swap)

  const paddingX = props.isNarrowVersion ? '16px' : '40px'

  const onSelectType = (type: TradeType) => {
    if (type !== selectedType) {
      setSelectedType(type)
    }
  }

  return (
    <SlippageProvider>
      <Flex
        border='1px solid'
        borderColor={isDarkMode ? colors.icGray3 : colors.icGray2}
        borderRadius='16px'
        direction='column'
        py='20px'
        px={['16px', paddingX]}
        height={'100%'}
      >
        <Navigation onSelect={onSelectType} selectedType={selectedType} />
        {selectedType === TradeType.flashMint && <FlashMint {...props} />}
        {selectedType === TradeType.swap && <QuickTrade {...props} />}
      </Flex>
    </SlippageProvider>
  )
}

type NavigationButtonProps = {
  isSelected: boolean
  onClick: () => void
  title: string
}

const NavigationButton = (props: NavigationButtonProps) => {
  const { isDarkMode } = useICColorMode()
  return (
    <Text
      borderBottom={props.isSelected ? '2px solid' : '0'}
      borderColor={isDarkMode ? colors.white : colors.black}
      color={props.isSelected ? 'inherit' : colors.icGray3}
      cursor='pointer'
      fontSize='20px'
      fontWeight='700'
      mr='16px'
      onClick={props.onClick}
    >
      {props.title}
    </Text>
  )
}

type NavigationProps = {
  onSelect: (type: TradeType) => void
  selectedType: TradeType
}

const Navigation = (props: NavigationProps) => {
  const { chain } = useNetwork()
  const { isDarkMode } = useICColorMode()
  const {
    auto: autoSlippage,
    isAuto: isAutoSlippage,
    set: setSlippage,
    slippage,
  } = useSlippage()

  const { onSelect, selectedType } = props
  const flashMintIsSelected = selectedType === TradeType.flashMint
  const swapIsSelected = selectedType === TradeType.swap

  const shouldShowFlashMint = chain !== undefined && chain.id === 10

  return (
    <Flex align='center' justify='space-between'>
      <Flex>
        <NavigationButton
          isSelected={swapIsSelected}
          onClick={() => onSelect(TradeType.swap)}
          title='Swap'
        />
        {shouldShowFlashMint && (
          <NavigationButton
            isSelected={flashMintIsSelected}
            onClick={() => onSelect(TradeType.flashMint)}
            title='Flash Mint'
          />
        )}
      </Flex>
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
