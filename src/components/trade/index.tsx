import { useState } from 'react'

import { colors, useColorStyles, useICColorMode } from 'styles/colors'

import { Flex, Text } from '@chakra-ui/react'

import { useNetwork } from 'hooks/useNetwork'
import { SlippageProvider, useSlippage } from 'providers/Slippage'
import { isTokenAvailableForFlashMint } from 'utils/tokens'

import { QuickTradeSettingsPopover } from './_shared/QuickTradeSettingsPopover'
import FlashMint from './flashmint'
import QuickTrade, { QuickTradeProps } from './swap'

enum TradeType {
  flashMint,
  swap,
}

const QuickTradeContainer = (props: QuickTradeProps) => {
  const { chainId } = useNetwork()
  const { styles } = useColorStyles()
  const [selectedType, setSelectedType] = useState<TradeType>(
    TradeType.flashMint
  )

  const paddingX = props.isNarrowVersion ? '16px' : '40px'

  const shouldShowFlashMintOption = props.singleToken
    ? isTokenAvailableForFlashMint(props.singleToken, chainId)
    : true

  const onSelectType = (type: TradeType) => {
    if (type !== selectedType) {
      setSelectedType(type)
    }
  }

  const onSwitchTabs = () => {
    setSelectedType(TradeType.flashMint)
  }

  return (
    <SlippageProvider>
      <Flex
        bgGradient={styles.backgroundGradient}
        border='1px solid'
        borderColor={styles.border}
        borderRadius='16px'
        boxShadow='sm'
        direction='column'
        py='20px'
        px={['16px', paddingX]}
        height={'100%'}
      >
        <Navigation
          onSelect={onSelectType}
          selectedType={selectedType}
          shouldShowFlashMintOption={shouldShowFlashMintOption}
        />
        {selectedType === TradeType.flashMint && <FlashMint {...props} />}
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
  shouldShowFlashMintOption: boolean
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
    <Flex align='center' justify='space-between'>
      <Flex>
        {props.shouldShowFlashMintOption && (
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
