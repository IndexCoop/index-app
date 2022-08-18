import { colors, useICColorMode } from 'styles/colors'

import { Box, Flex, Image, Text } from '@chakra-ui/react'

import { Token } from 'constants/tokens'

import QuickTradeSelector from './QuickTradeSelector'

type DirectIssuanceProps = {
  indexToken: Token
  indexTokenList: Token[]
  indexTokenAmountFormatted: string | undefined
  inputOutputToken: Token
  formattedBalance: string
  formattedBalanceInputOutputToken: string
  isDarkMode: boolean
  isIssue: boolean
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
  inputOutputToken,
  formattedBalance,
  formattedBalanceInputOutputToken,
  isDarkMode,
  isIssue,
  isNarrow,
  onChangeBuyTokenAmount,
  onSelectIndexToken,
  onSelectInputOutputToken,
  onToggleIssuance,
  priceImpact,
}: DirectIssuanceProps) => (
  <>
    <Flex>
      <Flex border='2px solid' borderColor={colors.icGray3} borderRadius='16'>
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
    <Box
      borderColor={isDarkMode ? colors.icWhite : colors.black}
      paddingTop='16px'
    >
      <QuickTradeSelector
        title={''}
        config={{
          isDarkMode,
          isInputDisabled: false,
          isNarrowVersion: isNarrow,
          isSelectorDisabled: false,
          isReadOnly: false,
        }}
        selectedToken={indexToken}
        selectedTokenAmount={indexTokenAmountFormatted}
        formattedFiat=''
        priceImpact={priceImpact}
        tokenList={indexTokenList}
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
          border='1px solid'
          borderColor={colors.icGray2}
          borderRadius='16'
          cursor='pointer'
          p='12px'
          onClick={onSelectInputOutputToken}
        >
          <Image
            src={inputOutputToken.image}
            alt={inputOutputToken.name + ' logo'}
            w='30px'
            h='30px'
          />
        </Flex>
        <Text fontWeight='600' marginLeft='16px'>
          {formattedBalance}
        </Text>
      </Flex>
      <Text marginTop='8px' fontSize='12px' fontWeight='400'>
        {inputOutputToken.symbol} Balance: {formattedBalanceInputOutputToken}
      </Text>
    </Box>
  </>
)

type NavigationButtonProps = {
  isSelected: boolean
  onSelect: () => void
  title: string
}

const NavigationButton = (props: NavigationButtonProps) => {
  const { isDarkMode } = useICColorMode()
  const backgroundColor = isDarkMode ? colors.background : colors.white
  return (
    <Text
      background={props.isSelected ? colors.icGray3 : backgroundColor}
      borderRadius={14}
      color={props.isSelected ? colors.white : colors.icGray3}
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
