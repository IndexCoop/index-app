import {
  colors,
  colorStyles,
  useColorStyles,
  useICColorMode,
} from '@/lib/styles/colors'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Flex, Image, Text } from '@chakra-ui/react'

import { Token } from '@/constants/tokens'

import { TradeInputSelector } from '../swap/components/trade-input-selector'

type DirectIssuanceProps = {
  indexToken: Token
  indexTokenAmountFormatted: string
  indexTokenBalanceFormatted: string
  indexTokenFiatFormatted: string
  inputOutputToken: Token
  inputOutputTokenAmountFormatted: string
  inputOutputTokenBalanceFormatted: string
  inputOutputTokenFiatFormatted: string
  isIssue: boolean
  isMintable: boolean
  onChangeBuyTokenAmount: (token: Token, input: string) => void
  onClickBalance: () => void
  onSelectIndexToken: () => void
  onSelectInputOutputToken: () => void
  onToggleIssuance: (toggled: boolean) => void
  priceImpact?: { priceImpact: string; colorCoding: string } | undefined
}

const DirectIssuance = ({
  indexToken,
  indexTokenAmountFormatted,
  indexTokenBalanceFormatted,
  indexTokenFiatFormatted,
  inputOutputToken,
  inputOutputTokenAmountFormatted,
  inputOutputTokenBalanceFormatted,
  inputOutputTokenFiatFormatted,
  isIssue,
  isMintable,
  onClickBalance,
  onChangeBuyTokenAmount,
  onSelectIndexToken,
  onSelectInputOutputToken,
  onToggleIssuance,
  priceImpact,
}: DirectIssuanceProps) => {
  const { isDarkMode } = useICColorMode()
  return (
    <>
      <Flex>
        <Flex border='2px solid' borderColor={colors.icGray1} borderRadius='16'>
          <NavigationButton
            isSelected={isIssue}
            onSelect={() => onToggleIssuance(true)}
            title='Mint'
          />
          <NavigationButton
            isSelected={!isIssue}
            onSelect={() => onToggleIssuance(false)}
            title='Redeem'
          />
        </Flex>
      </Flex>
      <Flex justify='center' mt='4'></Flex>
      <Box borderColor={isDarkMode ? colors.icWhite : colors.black}>
        <TradeInputSelector
          caption=''
          config={{
            isInputDisabled: isIssue && !isMintable,
            isSelectorDisabled: isIssue && !isMintable,
            isReadOnly: isIssue && !isMintable,
          }}
          balance={indexTokenBalanceFormatted}
          selectedToken={indexToken}
          selectedTokenAmount={indexTokenAmountFormatted}
          formattedFiat={indexTokenFiatFormatted}
          priceImpact={{
            colorCoding: priceImpact?.colorCoding ?? '',
            value: priceImpact?.priceImpact ?? '',
          }}
          onChangeInput={onChangeBuyTokenAmount}
          onClickBalance={onClickBalance}
          onSelectToken={onSelectIndexToken}
        />
        <Text marginTop='16px' textColor={colors.icBlack}>
          {isIssue
            ? `Estimated ${inputOutputToken.symbol} required for mint (inc. slippage)`
            : `Estimated ${inputOutputToken.symbol} output for redemption (inc. slippage)`}
        </Text>
        <Flex alignItems='center' marginTop='8px'>
          <Flex
            align='center'
            bg={colors.icGray1}
            border='1px solid'
            borderColor={colorStyles(isDarkMode).border}
            borderRadius='16'
            boxShadow='sm'
            cursor='pointer'
            p='12px'
            pr='8px'
            onClick={onSelectInputOutputToken}
          >
            <Image
              src={inputOutputToken.image}
              alt={inputOutputToken.name + ' logo'}
              w='30px'
              h='30px'
            />
            <ChevronDownIcon ml={1} w={6} h={6} color={colors.icGray4} />
          </Flex>
          <Flex direction='column' marginLeft='16px'>
            <Text fontWeight='600' textColor={colors.icBlack}>
              {inputOutputTokenAmountFormatted}
            </Text>
            <Text fontSize='12px' textColor={colorStyles(isDarkMode).text3}>
              {inputOutputTokenFiatFormatted}
            </Text>
          </Flex>
        </Flex>
        <Text marginTop='8px' fontSize='12px' fontWeight='400'>
          {inputOutputToken.symbol} Balance: {inputOutputTokenBalanceFormatted}
        </Text>
      </Box>
    </>
  )
}

type NavigationButtonProps = {
  isSelected: boolean
  onSelect: () => void
  title: string
}

const NavigationButton = (props: NavigationButtonProps) => {
  const { styles } = useColorStyles()
  const backgroundColor = styles.background
  const backgroundSelectedColor = colors.icGray2
  const selectedColor = colors.icWhite
  return (
    <Text
      background={props.isSelected ? backgroundSelectedColor : backgroundColor}
      borderRadius={13}
      color={props.isSelected ? selectedColor : backgroundSelectedColor}
      cursor='pointer'
      fontSize='21px'
      fontWeight='700'
      padding='4px 12px'
      onClick={props.onSelect}
    >
      {props.title}
    </Text>
  )
}

export default DirectIssuance
