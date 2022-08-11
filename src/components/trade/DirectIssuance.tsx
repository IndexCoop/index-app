import { colors, useICColorMode } from 'styles/colors'

import { Box, Flex, Image, Text } from '@chakra-ui/react'

import { Token, USDC } from 'constants/tokens'

import QuickTradeSelector from './QuickTradeSelector'

type DirectIssuanceProps = {
  buyToken: Token
  buyTokenList: Token[]
  buyTokenAmountFormatted: string | undefined
  formattedBalance: string
  formattedUSDCBalance: string
  isDarkMode: boolean
  isIssue: boolean
  isNarrow: boolean
  onChangeBuyTokenAmount: (token: Token, input: string) => void
  onSelectedToken: () => void
  onToggleIssuance: (toggled: boolean) => void
  priceImpact?: { priceImpact: string; colorCoding: string } | undefined
}

const DirectIssuance = ({
  buyToken,
  buyTokenList,
  buyTokenAmountFormatted,
  formattedBalance,
  formattedUSDCBalance,
  isDarkMode,
  isIssue,
  isNarrow,
  onChangeBuyTokenAmount,
  onSelectedToken,
  onToggleIssuance,
  priceImpact,
}: DirectIssuanceProps) => (
  <>
    <Flex>
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
        selectedToken={buyToken}
        selectedTokenAmount={buyTokenAmountFormatted}
        formattedFiat=''
        priceImpact={priceImpact}
        tokenList={buyTokenList}
        onChangeInput={onChangeBuyTokenAmount}
        onSelectedToken={(_) => onSelectedToken()}
      />
      <Text marginTop='16px'>
        {isIssue
          ? 'Estimated USDC required for mint (inc. slippage)'
          : 'Estimated USDC output for redemption (inc. slippage)'}
      </Text>
      <Flex alignItems='center' marginTop='8px'>
        <Image src={USDC.image} alt={USDC.name + ' logo'} w='48px' h='48px' />
        <Text fontWeight='600' marginLeft='16px'>
          {formattedBalance}
        </Text>
      </Flex>
      <Text marginTop='8px' fontSize='12px' fontWeight='400'>
        USDC Balance: {formattedUSDCBalance}
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
      background={props.isSelected ? colors.icGray1 : backgroundColor}
      borderRadius={32}
      color={props.isSelected ? colors.icBlack : colors.icGray3}
      cursor='pointer'
      fontSize='22px'
      fontWeight='700'
      padding='4px 12px'
      onClick={props.onSelect}
    >
      {props.title}
    </Text>
  )
}

export default DirectIssuance
