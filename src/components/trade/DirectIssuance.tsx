import { colors } from 'styles/colors'

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
  onToggleIssuance,
  priceImpact,
}: DirectIssuanceProps) => (
  <>
    <Flex>
      <Box
        borderTopLeftRadius='16px'
        borderBottomLeftRadius='16px'
        border='1px solid black'
        borderColor={isDarkMode ? colors.icWhite : colors.black}
        padding='8px'
        _hover={{ fontWeight: 700 }}
        cursor='pointer'
        onClick={() => onToggleIssuance(true)}
        fontWeight={isIssue ? 700 : 400}
      >
        Mint Tokens
      </Box>
      <Box
        borderTopRightRadius='16px'
        borderBottomRightRadius='16px'
        border='1px solid black'
        borderColor={isDarkMode ? colors.icWhite : colors.black}
        padding='8px'
        _hover={{ fontWeight: 700 }}
        cursor='pointer'
        fontWeight={!isIssue ? 700 : 400}
        onClick={() => onToggleIssuance(false)}
      >
        Redeem Tokens
      </Box>
    </Flex>
    <Box
      borderColor={isDarkMode ? colors.icWhite : colors.black}
      paddingTop='16px'
    >
      <QuickTradeSelector
        title={isIssue ? 'Mint' : 'Redeem'}
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
        onSelectedToken={(_) => {}}
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

export default DirectIssuance
