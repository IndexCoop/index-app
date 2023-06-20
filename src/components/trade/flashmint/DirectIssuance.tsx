import {
  colors,
  colorStyles,
  useColorStyles,
  useICColorMode,
} from '@/lib/styles/colors'

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Flex, Image, Text } from '@chakra-ui/react'

import { Token } from '@/constants/tokens'

import TradeInputSelector from '../_shared/TradeInputSelector'

type DirectIssuanceProps = {
  indexToken: Token
  indexTokenList: Token[]
  indexTokenAmountFormatted: string | undefined
  indexTokenFiatFormatted: string
  inputOutputToken: Token
  inputOutputTokenAmountFormatted: string
  inputOutputTokenBalanceFormatted: string
  inputOutputTokenFiatFormatted: string
  isIssue: boolean
  isMintable: boolean
  isNarrow: boolean
  onChangeBuyTokenAmount: (token: Token, input: string) => void
  onSelectIndexToken: () => void
  onSelectInputOutputToken: () => void
  onToggleIssuance: (toggled: boolean) => void
  priceImpact?: { priceImpact: string; colorCoding: string } | undefined
}

const DirectIssuance = ({
  indexToken,
  indexTokenList,
  indexTokenAmountFormatted,
  indexTokenFiatFormatted,
  inputOutputToken,
  inputOutputTokenAmountFormatted,
  inputOutputTokenBalanceFormatted,
  inputOutputTokenFiatFormatted,
  isIssue,
  isMintable,
  isNarrow,
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
      <Box
        borderColor={isDarkMode ? colors.icWhite : colors.black}
        paddingTop='16px'
      >
        <TradeInputSelector
          config={{
            isDarkMode,
            isInputDisabled: isIssue && !isMintable,
            isNarrowVersion: isNarrow,
            isSelectorDisabled: isIssue && !isMintable,
            isReadOnly: isIssue && !isMintable,
            showMaxLabel: isIssue && isMintable,
          }}
          selectedToken={indexToken}
          selectedTokenAmount={indexTokenAmountFormatted}
          formattedFiat={indexTokenFiatFormatted}
          priceImpact={priceImpact}
          onChangeInput={onChangeBuyTokenAmount}
          onSelectedToken={(_) => onSelectIndexToken()}
        />
        <Text marginTop='16px'>
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
            <Text fontWeight='600'>{inputOutputTokenAmountFormatted}</Text>
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
  const { isDarkMode, styles } = useColorStyles()
  const backgroundColor = styles.background
  const backgroundSelectedColor = isDarkMode ? colors.icGray1 : colors.icGray2
  const selectedColor = isDarkMode ? colors.icBlack : colors.icWhite
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
