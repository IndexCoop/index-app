import { useState } from 'react'

import { colors, useICColorMode } from '../../lib/styles/colors'

import { Flex, Text } from '@chakra-ui/react'

import { Settings } from '@/components/settings'
import { useSlippage } from '@/lib/providers/slippage'

import FlashMint from './flashmint'
import QuickTrade, { QuickTradeProps } from './swap'

enum TradeType {
  flashMint,
  swap,
}

const QuickTradeContainer = (props: QuickTradeProps) => {
  const [selectedType, setSelectedType] = useState<TradeType>(TradeType.swap)

  const shouldShowSwap = true
  const shouldShowFlashMintOption = true

  const onSelectType = (type: TradeType) => {
    if (type !== selectedType) {
      setSelectedType(type)
    }
  }

  const onSwitchTabs = () => {
    setSelectedType(TradeType.flashMint)
  }

  return (
    <Flex
      background='linear-gradient(33deg, rgba(0, 189, 192, 0.05) -9.23%, rgba(0, 249, 228, 0.05) 48.82%, rgba(212, 0, 216, 0.05) 131.54%), linear-gradient(187deg, #FCFFFF -184.07%, #F7F8F8 171.05%)'
      border='1px solid'
      borderColor={colors.icGray1}
      borderRadius='24px'
      boxShadow='0.5px 1px 2px 0px rgba(44, 51, 51, 0.25), 2px 2px 1px 0px #FCFFFF inset'
      direction='column'
      p='8px 16px 16px'
      height={'100%'}
    >
      <Navigation
        onSelect={onSelectType}
        selectedType={selectedType}
        shouldShowFlashMintOption={shouldShowFlashMintOption}
        shouldShowSwap={shouldShowSwap}
      />
      {selectedType === TradeType.flashMint && <FlashMint {...props} />}
      {selectedType === TradeType.swap && (
        <QuickTrade {...props} switchTabs={onSwitchTabs} />
      )}
    </Flex>
  )
}

type NavigationButtonProps = {
  isSelected: boolean
  onClick: () => void
  title: string
}

const NavigationButton = (props: NavigationButtonProps) => {
  return (
    <Text
      color={props.isSelected ? colors.icGray4 : colors.icGray2}
      cursor='pointer'
      fontSize='14px'
      fontWeight='700'
      onClick={props.onClick}
    >
      {props.title}
    </Text>
  )
}

type NavigationProps = {
  onSelect: (type: TradeType) => void
  selectedType: TradeType
  shouldShowFlashMintOption: boolean
  shouldShowSwap: boolean
}

const Navigation = (props: NavigationProps) => {
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

  return (
    <Flex align='center' justify='space-between' pl={'16px'}>
      <Flex gap={'24px'}>
        {props.shouldShowSwap && (
          <NavigationButton
            isSelected={swapIsSelected}
            onClick={() => onSelect(TradeType.swap)}
            title='Swap'
          />
        )}
        {props.shouldShowFlashMintOption && (
          <NavigationButton
            isSelected={flashMintIsSelected}
            onClick={() => onSelect(TradeType.flashMint)}
            title='Flash Mint'
          />
        )}
      </Flex>
      <Settings
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
